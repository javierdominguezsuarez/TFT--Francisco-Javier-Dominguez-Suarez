import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StorageService } from '@shared/services';
import { Subject, take } from 'rxjs';

@Component({
  selector: 'app-scene-form',
  templateUrl: './scene-form.component.html',
  styleUrls: ['./scene-form.component.scss']
})
export class SceneFormComponent {
  @ViewChild('coordinatesError', { static: false }) coordinatesErrorRef!: ElementRef
  @ViewChild('videoTimeError', { static: false }) videoTimeErrorRef!: ElementRef
  @ViewChild('focusTimeError', { static: false }) focusTimeErrorRef!: ElementRef
  @ViewChild('emptyError', { static: false }) emptyErrorRef!: ElementRef
  @ViewChild('emptyNameError', { static: false }) emptyNameErrorRef!: ElementRef
  @ViewChild('priorityError', { static: false }) emptyPriorityErrorRef!: ElementRef
  @ViewChild('totalTimeError', { static: false }) totalTimeErrorRef!: ElementRef

  @Input() parentTime: string
  @Input() scene: any
  @Input() index: number
  @Output() exit = new EventEmitter()
  @Output() notification = new EventEmitter<void>()

  imageEvent: Subject<any> = new Subject<any>()
  step: number = 1
  secondForm: FormGroup
  time: number = 0
  videoTime: number = 0
  picTime: number = 0
  totalTime: number = 300
  pic: boolean = false
  video: boolean = false
  coordinatesError: boolean = false
  videoTimeError: boolean = false
  focusTimeError: boolean = false
  noPicVideoError: boolean = false
  emptyNameError: boolean = false
  priorityError: boolean = false
  totalTimeError: boolean = false
  flagCaptureIframe: boolean = false
  defaultImage: string = '/assets/img/poster/posterStreaming3.jpg'
  imageSrc: string = '/assets/img/poster/posterStreaming3.jpg'
  
  constructor(private formBuilder: FormBuilder, private storageService: StorageService) { }

  ngOnInit(): void {
    if (this.scene) {
      this.secondForm = this.formBuilder.group({ x: this.scene.x, y: this.scene.y, z: this.scene.z, name: this.scene.name, focusTime: '', priority: this.scene.priority, videoTime: '', video: '', pic: '', preview: this.scene.preview, time: this.scene.time })
      this.time = parseInt(this.parentTime) - this.scene.time
    } else {
      this.secondForm = this.formBuilder.group({ x: '', y: '', z: '', name: '', focusTime: '', priority: '', videoTime: '', video: '', pic: '', preview: '../../../../../assets/img/poster/posterStreaming3.jpg', time: '' })
      this.time = parseInt(this.parentTime)
    }


    this.secondForm.controls['pic'].valueChanges.subscribe((value: boolean) => {
      console.log(value)
      if (value) {
        this.pic = true
        this.recalculateTime()
      } else {
        this.pic = false
        this.recalculateTime()
      }
    })


    this.secondForm.controls['video'].valueChanges.subscribe((value: boolean) => {
      if (value) {
        this.video = true
        this.recalculateTime()
      } else {
        this.video = false
        this.recalculateTime()
      }
    })

    this.secondForm.controls['videoTime'].valueChanges.subscribe((value: string) => {
      if (parseInt(value) > 0 && parseInt(value) <= 90) {
        this.videoTime = parseInt(value)
      } else {
        this.videoTime = 0
      }

      this.recalculateTime()
    })
    this.secondForm.controls['focusTime'].valueChanges.subscribe((value: string) => {
      if (parseInt(value) > 0 && parseInt(value) <= 90) {
        this.picTime = parseInt(value)
      } else {
        this.picTime = 0
      }
      this.recalculateTime()

    })
    console.log("INDICE: ", this.index)
  }

  ngAfterViewInit(): void {
    if (this.coordinatesErrorRef) this.coordinatesErrorHandler()
    if (this.videoTimeErrorRef) this.videoTimeErrorHandler()
    if (this.focusTimeErrorRef) this.focusTimeErrorHandler()
    if (this.emptyErrorRef) this.emptyErrorHandler()
    if (this.emptyNameErrorRef) this.emptyNameErrorHandler()
    if (this.emptyPriorityErrorRef) this.emptyPriorityErrorHandler()
    if (this.totalTimeErrorRef) this.totalTimeErrorHandler()

  }


  recalculateTime() {
    if (this.scene) {
      if ((this.videoTime === 0 && this.picTime === 0) || (!this.pic && !this.video)) {
        console.log("same Time")
        this.time = parseInt(this.parentTime) - this.scene.time
      } else if (this.video && this.pic) {
        this.time = this.videoTime + this.picTime + 37 + parseInt(this.parentTime) - this.scene.time
      }
      else if (this.picTime !== 0 && this.pic) {
        this.time = this.picTime + 6 + parseInt(this.parentTime) - this.scene.time
        this.time = this.videoTime + 31 + parseInt(this.parentTime) - this.scene.time
      }
      this.secondForm.controls['time'].setValue(this.time)
    } else {
      if ((this.videoTime === 0 && this.picTime === 0) || (!this.pic && !this.video)) {
        console.log("same Time")
        this.time = parseInt(this.parentTime)
      } else if (this.video && this.pic) {
        this.time = this.videoTime + this.picTime + 37 + parseInt(this.parentTime)
      }
      else if (this.picTime !== 0 && this.pic) {
        this.time = this.picTime + 6 + parseInt(this.parentTime)
      } else if (this.videoTime !== 0 && this.video) {
        this.time = this.videoTime + 31 + parseInt(this.parentTime)
      }
      this.secondForm.controls['time'].setValue(this.time)
    }
  }
  nextStep() {
    if (this.step < 3) {
      if (this.step === 1) {
        if (this.checkCoordinates() === true) {
          if(this.flagCaptureIframe === true){
            if (this.defaultImage !== this.imageSrc) {
              this.step+=1
            }else {
            const promesa = new 
            Promise<void>((resolve) => {
              this.notification.emit()

              this.imageEvent.pipe(take(1)).subscribe((event: any) => {
                this.setPreview(event)
                resolve()
              })
            })

            promesa.then(() => {
              this.step += 1
            })
          }
          }else{
            this.step +=1
          }
          


        } else {
          this.coordinatesError = true
        }

      } else if (this.step === 2) {
        this.step += 1
      }

    }
    console.log(this.step)
  }

  checkCoordinates(): boolean {
    if (
      this.secondForm.value.x !== '' &&
      this.secondForm.value.y !== '' &&
      this.secondForm.value.z !== ''
    ) {
      console.log("cordenadas correctas")
      return true
    } else {
      return false
    }
  }

  checkPicOrVideo(): boolean {
    if ((this.secondForm.value.video !== '' || this.secondForm.value.pic !== '') && (this.secondForm.value.videoTime !== 0 || this.secondForm.value.picTime !== 0)) {
      return true
    } else {
      this.noPicVideoError = true
      return false
    }
  }

  checkVideoTime(): boolean {
    if (this.secondForm.value.video === true) {
      if (this.secondForm.value.videoTime < 90 && this.secondForm.value.videoTime != '') {
        return true
      } else {
        this.videoTimeError = true
        return false
      }
    } else {
      return true
    }

  }
  checkSceneName(): boolean {
    if (this.secondForm.value.name != '') {
      return true
    } else {
      this.emptyNameError = true
      return false
    }
  }

  checkFocusTime(): boolean {
    if (this.secondForm.value.pic === true) {
      if (this.secondForm.value.focusTime >= 0 && this.secondForm.value.focusTime !== '') {
        return true
      } else {
        this.focusTimeError = true
        return false

      }
    } else {
      return true
    }

  }
  checkPriority(): boolean {
    if (this.secondForm.value.priority != '') {
      return true
    } else {
      this.priorityError = true
      return false
    }
  }
  checkTotalTime(): boolean {
    if (this.time < 300) {
      return true
    } else {
      this.totalTimeError = true
    }
  }

  checkFinalStep(): boolean {
    if (
      this.checkVideoTime() &&
      this.checkFocusTime() &&
      this.checkPicOrVideo() &&
      this.checkSceneName() &&
      this.checkPriority() &&
      this.checkTotalTime()
    ) {
      return true
    } else {
      return false
    }
  }

  previousStep() {
    if (this.step > 1) this.step = this.step - 1
  }

  updateCoordinates(event: any) {
    if (event != undefined) {
      this.secondForm.controls['x'].setValue(event.x)
      this.secondForm.value.x = event.x
      this.secondForm.controls['y'].setValue(event.y)
      this.secondForm.value.y = event.y
      this.secondForm.controls['z'].setValue(event.z)
      this.secondForm.value.z = event.z
      this.flagCaptureIframe = true
      console.log("Se ha accedido al control")
    }

  }

  onSubmit() {
    console.log("submiiiit")
    if (this.checkFinalStep()) {
      console.log("Third Step Correct")
      this.secondForm.value.preview = this.imageSrc
      if (this.scene) {
        this.secondForm.value.time -= parseInt(this.parentTime) - this.scene.time
      } else {
        this.secondForm.value.time -= parseInt(this.parentTime)
      }
      if (this.index !== undefined) {
        console.log("INDICE: ", this.index)
        this.exit.emit({ scene: this.secondForm.value, index: this.index })
        console.log("Hay indice")
      } else {
        this.exit.emit(this.secondForm.value)
      }


    } else {
      console.log("Third Step Not Correct")
    }
    console.log(this.secondForm.value)
  }

  handleFileInput(event: any) {
    const file = event.target.files[0]
    if (file) {
      if (
        file.type === 'image/jpg' ||
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/icon' ||
        file.type === 'image/svg'
      ) {
        const reader = new FileReader()
        reader.onload = (e: any) => {
          const base64 = e.target.result?.split(',')[1]
          if (base64) {
            this.imageSrc = e.target.result
          } else {
            console.error('Failed to extract base64 data from file')
          }
        }
        reader.readAsDataURL(file)
      } else {
        console.error('Unsupported file format')
        const fileInput = document.getElementById('selectedFile') as HTMLInputElement
        if (fileInput) fileInput.value = ''
      }
    }
  }

  setPreview(event: any) {
    this.imageSrc = event
    this.imageEvent.next(event)

  }


  coordinatesErrorHandler() {
    if (this.coordinatesError === true) this.coordinatesError = false
  }
  videoTimeErrorHandler() {
    if (this.videoTimeError === true) this.videoTimeError = false
  }
  focusTimeErrorHandler() {
    if (this.focusTimeError === true) this.focusTimeError = false
  }
  emptyErrorHandler() {
    if (this.noPicVideoError === true) this.noPicVideoError = false
  }
  emptyNameErrorHandler() {
    if (this.emptyNameError === true) this.emptyNameError = false
  }
  emptyPriorityErrorHandler() {
    if (this.priorityError === true) this.priorityError = false
  }
  totalTimeErrorHandler() {
    if (this.totalTimeError === true) this.totalTimeError = false
  }

  ngOnDestroy(): void {
    this.imageEvent.unsubscribe()
  }

}

