import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { NumberValueAccessor } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CameraControlService } from '@camera-control/services/camera-control.service';
import { ZoomService } from '@events/services/zoom.service';
import { Camera, Stream } from '@shared/models';
import { CameraService } from '@shared/services';
import {  Observable, Subscription} from 'rxjs';
import Swal from 'sweetalert2';

interface Square {
  x: number;
  y: number;
  width: number;
  height: number;
  canvasWidth: number;
  canvasHeight: number;
}

@Component({
  selector: 'app-camera-control-v2',
  templateUrl: './camera-control-v2.component.html',
  styleUrls: ['./camera-control-v2.component.scss']
})
export class CameraControlV2Component {

  @ViewChild('parent') parent: ElementRef
  @ViewChild('player') player: ElementRef

  @ViewChild('error')
  set error(error: ElementRef) {
    if (error) {
      this.errorHandler()
    }
  }
  @ViewChild('borderError')
  set errorRange(borderError: ElementRef) {
    if (borderError) {
      this.borderErrorHandler()
    }
  }
  @Output() newCoordinates = new EventEmitter<any>()
  @Output() image = new EventEmitter<any>()
  @Input() notification: EventEmitter<void>
  camera: Camera
  stream: Stream
  cameraReference: string
  routeSubscription: Subscription
  countdownSubscription: Subscription
  hover: Boolean = false
  lock: Boolean = true
  fullScreen: Boolean = false
  position: any
  sliderValue: number
  remainingTime: number
  countdownStarted = false
  timeString: string
  zoomError: boolean = false
  borderError: boolean = false
  crop: boolean = false
  scUrl: string
  previewFile: any

  constructor(private cameraService: CameraService, public cameraControlService: CameraControlService,
    private route: ActivatedRoute, private elementRef: ElementRef, private zoomService: ZoomService) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe(params => {
      this.cameraReference = params['cameraReference']
      console.log(this.cameraReference)
      let query = '[{"where":{"field":"device.reference","operator":"eq","data":"' + this.cameraReference + '"}}]'
      this.cameraService.get('plain/json', query).toPromise()
        .then((response) => {
          this.camera = response.data[0]
          this.initStream()
        })
    })
    this.sliderValue = 4
    this.setMessageListener()
    this.notification.subscribe(async () => {
      console.log("EVENTO RECIBIDO EN HIJO")
      this.saveImage()
    })  
  }

  initStream() {
    let query = '[{"where":{"field":"description","operator":"like","data":"SD"}},{"orderByDesc":"created_at"}]'
    this.cameraService.getStream(this.camera.id, 'plain/json', query).toPromise()
      .then((response: any) => {
        let stream = response.data[0]
        if (stream !== undefined) {
          this.stream = stream
          if (this.cameraReference === "mandela" || this.cameraReference === "cabotorres") {
            this.stream.data.video_url = this.stream.data.video_url.slice(0, -1) + '2'
          } else {
            this.stream.data.video_url = this.stream.data.video_url.slice(0, -1) + '3'
          }


        }
      })
      console.log(this.stream)
  }

  addIframeVideo(name: string, isTag: boolean = false) {
    let iframe = '<iframe id="iframe" allowfullscreen="true" seamless="seamless" crossorigin="anonymous" ' +
      'src="https://ant.qaisc.com:5443/WebRTCAppEE/play.html?name=' + name + '&autoplay=true&playOrder=webrtc&tag=' + isTag + '" ' +
      'style="display:block;width:100%;height:100%;pointer-events:none;" frameborder="0" ></iframe>'

    this.parent.nativeElement.innerHTML = iframe
  }

  unlock() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You are accessing manual control of " + this.cameraReference + "!",
      icon: 'warning',
      showCancelButton: true,
      target: this.player.nativeElement,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes access it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.initStream()
        this.lock = false
        this.addIframeVideo(this.stream.data.video_url)
        this.cameraControlService.getSession(this.camera.id).toPromise()
          .then(res => {
            this.cameraControlService.currentSession = res.data[0]
            this.getPosition()
          })

        this.startCountdown()
        this.getPosition()

        console.log("UNLOCK")
      } else {
        console.log("UNLOCK-CANCELED")
      }
    })
  }

  startCountdown(): void {
    const duration = 600000
    this.cameraControlService.startCountdown(duration)

    this.countdownSubscription = this.cameraControlService.getRemainingTime().subscribe((remainingTime) => {
      this.remainingTime = remainingTime
      const minutes = Math.floor(remainingTime / 60000)
      const seconds = ((remainingTime % 60000) / 1000).toFixed(0)
      this.timeString = `${minutes}:${(+seconds < 10 ? '0' : '')}${seconds}`

      if (this.countdownStarted && remainingTime <= 0) {
        console.log('Countdown complete!')
        this.lock = true
        this.countdownStarted = false
        if (this.parent) {
          this.parent.nativeElement.firstChild.remove()
        }



      }
    })
    this.countdownStarted = true
  }

  cancelCountdown(): void {
    this.cameraControlService.cancelCountdown()
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe()
    }
    this.countdownStarted = false
  }


  hoverIn() {
    this.hover = true
  }

  hoverOut() {
    this.hover = false
  }

  getPosition() {
    if (this.cameraControlService.currentSession)
      this.cameraControlService.getPosition(this.cameraControlService.currentSession.id).toPromise()
        .then(res => {
          this.position = res.data[0]
          console.log(this.position)   
          this.newCoordinates.emit(this.position,)
        })

  }

  moveCamera(name: string, x: number, y: number, z: number) {
    if (this.cameraControlService.currentSession) {
      this.cameraControlService.moveCamera(name, x, y, z, this.cameraControlService.currentSession.id)
    }
  }

  zoomCamera(name: string, z: any) {
    if (this.cameraControlService.currentSession) {
      if (this.position.z + z > 1 || this.position.z + z < 0) {
        if (this.position.z < 0.5) {
          this.cameraControlService.move(name, 0, this.cameraControlService.currentSession.id)
        } else {
          this.cameraControlService.move(name, 1, this.cameraControlService.currentSession.id)
        }
        console.log("Avisar limite o tope de zoom")
        this.zoomError = true
      } else {
        if (this.position.z < 0.30) {
          if (z > 0) {
            this.cameraControlService.move(name, this.position.z + 0.05, this.cameraControlService.currentSession.id)
          } else {
            this.cameraControlService.move(name, this.position.z - 0.05, this.cameraControlService.currentSession.id)
          }

        } else {
          if (z > 0) {
            this.cameraControlService.move(name, this.position.z + 0.175, this.cameraControlService.currentSession.id)
          } else {
            this.cameraControlService.move(name, this.position.z - 0.175, this.cameraControlService.currentSession.id)
          }

        }

        console.log("CHANGING ZOOM:" + " " + this.position.z + z)
      }
    }
  }

  stopCamera(name: string) {
    if (this.cameraControlService.currentSession) {
      this.cameraControlService.stopCamera(name, this.cameraControlService.currentSession.id)
      this.getPosition()
    }
  }

  whiper() {
    if (this.cameraControlService.currentSession) {
      this.cameraControlService.wiper(this.cameraControlService.currentSession.id)
    }
  }

  errorHandler() {
    if (this.zoomError === true) this.zoomError = false
  }
  borderErrorHandler() {
    if (this.borderError === true) this.borderError = false
  }

  makeFullScreen() {
    this.fullScreen = true;
    const playerElement = this.elementRef.nativeElement.querySelector('.player')

    if (playerElement.requestFullscreen) {
      playerElement.requestFullscreen()
    } else if (playerElement.webkitRequestFullscreen) {
      playerElement.webkitRequestFullscreen()
    }

    document.addEventListener('fullscreenchange', this.onFullscreenChange.bind(this))

  }

  onFullscreenChange() {
    if (!document.fullscreenElement) {
      this.fullScreen = false
      this.scapeFullScreen()
    }
  }
  scapeFullScreen() {
    if (document.fullscreenElement !== null) {
      document.exitFullscreen()
      this.fullScreen = false
    }
  }
  captureScreenshot() {
    let iframe = document.getElementById('iframe') as HTMLIFrameElement
    iframe?.contentWindow.postMessage('takeCapture', "*")

  }

  onSliderChange(event: any) {
    this.sliderValue = parseInt((event.target as HTMLInputElement).value)
    this.cameraControlService.currentVel = this.sliderValue

  }


  handleCropData(cropData: any) {
    const iframeElement = this.player.nativeElement;
    const iframeRect = iframeElement.getBoundingClientRect()

    const imageWidth = iframeElement.clientWidth;
    const imageHeight = iframeElement.clientHeight;

    const absoluteCropData = {
      x: (cropData.x / 100) * imageWidth + iframeRect.left,
      y: (cropData.y / 100) * imageHeight + iframeRect.top,
      width: (cropData.width / 100) * imageWidth,
      height: (cropData.height / 100) * imageHeight
    }

    console.log(absoluteCropData);
  }

  @HostListener('window:beforeunload', ['$event'])
  canDesactivate(): Observable<boolean> | boolean {
    if (this.lock === false) {
      this.cameraControlService.removeSession(this.cameraControlService.currentSession.id).toPromise()
        .then(() => {
          if (this.cameraControlService.currentSession !== '') {
            this.cameraControlService.currentSession = ''
            this.lock = true
            this.cancelCountdown()
            return true
          }

        })
      return false
    } else {
      return true
    }
  }

  startCrop() {
    if (this.crop == false) {
      this.crop = true
    }
  }
  onSquareCreated(square: Square) {
    console.log(square)
    setTimeout(() => {
      this.crop = false
    }, 150)
    const action = {
      x: this.position.x.toString(),
      y: this.position.y.toString(),
      z: this.position.z.toString(),
      zoom_rate: (1 - (square.height * square.width) / (square.canvasHeight * square.canvasWidth)).toString(),
      new_center_x: ((square.x + square.width / 2) / (square.canvasWidth)).toString(),
      new_center_y: ((square.y + square.height / 2) / (square.canvasHeight)).toString(),
      image_shape_width: square.canvasWidth.toString(),
      image_shape_height: square.canvasHeight.toString(),
      'mediaprofile': 'Profile_1'
    };
    if ( action.x < 0 || action.y < 0 || action.z < 0){
      this.borderError = true
    }else{
      this.cameraControlService.zoomToSector(this.cameraControlService.currentSession.id, action).toPromise().then((res) => {
        console.log(res)
        this.getPosition()
      })
    }

  }
  setMessageListener() {
    window.addEventListener('message', (event) => {
      if (event.data.action === 'returnData') {
        this.image.emit(event.data.data)
      }
    })
  }
  saveImage() {
    let iframe: HTMLIFrameElement = (document.getElementById('iframe') as HTMLIFrameElement)
    iframe?.contentWindow.postMessage('saveCapture', "*")
    
  }
  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe()
    if (this.cameraControlService.currentSession) {
      if (this.cameraControlService.currentSession.id)
        this.cameraControlService.removeSession(this.cameraControlService.currentSession.id).toPromise()
          .then(() => {
            this.cameraControlService.currentSession = ''
            this.cameraControlService.countdownSubscription = undefined

          })
    }

    this.cancelCountdown()
    if (this.countdownSubscription) this.countdownSubscription.unsubscribe()
    const messageEventHandler = (event) => {
      if (event.data.action === 'returnData') {
        this.image.emit(event.data.data)
      }
    }
    window.removeEventListener('message',messageEventHandler)
    document.removeEventListener('fullscreenchange', this.onFullscreenChange.bind(this))
  }


}
