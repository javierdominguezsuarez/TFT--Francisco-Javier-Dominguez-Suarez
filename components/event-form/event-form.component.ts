
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, catchError, forkJoin, map, switchMap, tap, throwError } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CameraService, SceneService, StorageService } from '@shared/services';
import { Scene, Stream } from '@shared/models';
import { Schedule, Task } from '@camera-settings/models';
import { ScheduleService, TaskService } from '@camera-settings/services';
import Swal from 'sweetalert2';
import { Cache } from '@camera-settings/models/cache';


@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})

export class EventFormComponent {

  @ViewChild('fieldsError', { static: false }) fieldsErrorRef!: ElementRef
  @ViewChild('dateError', { static: false }) dateErrorRef!: ElementRef
  @ViewChild('sceneAdded', { static: false }) sceneAddedRef!: ElementRef
  @ViewChild('sceneModified', { static: false }) sceneModifieddRef!: ElementRef

  step: number = 1
  cameraReference: string
  routeSubscription: Subscription
  firstForm: FormGroup
  toast: any
  allFieldsError: boolean = false
  dateError: boolean = false
  sceneForm: boolean = false
  modifySceneForm: boolean = false
  sceneAdded: boolean = false
  sceneModified: boolean = false
  dragStartIndex: number | undefined
  time: number = 0
  totalTime: number = 300
  sceneList: any[] = []
  currentIndex: number
  sceneToModify: any
  cameraId: number
  stream: Stream
  sceneIds: number[] = []
  createdTask: Task
  id: number
  edit: boolean = false
  editInformation: any
  constructor(private cameraService: CameraService, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private storageService: StorageService, private sceneService: SceneService, private taskService: TaskService, private scheduleService: ScheduleService) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe(params => {
      this.cameraReference = params['cameraReference']
      this.getCameraId()
      if (params['id']) {
        this.edit = true
        this.id = params['id']
        this.taskService.getEventEdition(this.id).pipe(
          tap(([event, scenes, schedule]) => {
            const eventData : Task = event.data[0]
            const scenesData: Scene[] = scenes.data
            const scheduleData: Schedule = schedule.data[0]
            this.editInformation = { eventData, scenesData , scheduleData }
            console.log({ eventData, scenesData, scheduleData })
          })
        ).subscribe(() => {
          this.firstForm = this.formBuilder.group({
            name: [this.editInformation.eventData.name],
            startDate: [this.editInformation.scheduleData.join_data[0].start.split(" ")[0]],
            startTime: [this.editInformation.scheduleData.join_data[0].start.split(" ")[1]],
            endDate: [this.editInformation.scheduleData.join_data[0].end.split(" ")[0]],
            endTime: [this.editInformation.scheduleData.join_data[0].end.split(" ")[1]],
            activated:[false]
          })
          this.sceneList = this.editInformation.scenesData
        })
      } else {
        this.firstForm = this.formBuilder.group({ name: '', startDate: '', startTime: '', endDate: '', endTime: '', activated: false })
      }
      console.log(this.cameraReference)
    })

  }

  ngAfterViewInit(): void {
    if (this.fieldsErrorRef) {
      this.allFieldsErrorHandler()
    }
    if (this.dateErrorRef) {
      this.dateErrorHandler()
    }
    if (this.sceneAddedRef) {
      this.sceneAddedHandler()
    }
  }

  getCameraId(): Promise<void> {
    return new Promise((resolve) => {
      this.cameraReference = this.route.snapshot.paramMap.get('cameraReference')
      let query = '[{"where":{"field":"device.reference","operator":"eq","data":"' + this.cameraReference + '"}}]'
      this.cameraService.get('plain/json', query).toPromise()
        .then((response) => {
          this.cameraId = response.data[0].id
          resolve()
        })
    })
  }

  nextStep() {
    if (!this.firstForm.valid) {
      this.allFieldsError = true

    } else {
      if (this.firstForm.value.endDate < this.firstForm.value.startDate) {
        this.dateError = true
      } else {
        if (this.step < 3) this.step += 1
        console.log(this.firstForm.value)
      }
    }


  }
  previousStep() {
    if (this.step >= 2) this.step -= 1
  }


  allFieldsErrorHandler() {
    console.log("second time")
    if (this.allFieldsError === true) this.allFieldsError = false
  }
  dateErrorHandler() {
    if (this.dateError === true) this.dateError = false
  }
  sceneAddedHandler() {
    if (this.sceneAdded === true) this.sceneAdded = false
  }
  sceneModifieddHandler() {
    if (this.sceneModified === true) this.sceneModified = false
  }
  openSceneForm() {
    console.log("openning")
    if (this.sceneForm === false) this.sceneForm = true
  }
  reopenSceneForm(scene: any) {
    console.log("reopenning")
    this.currentIndex = this.getSceneIndex(scene)
    this.sceneToModify = scene
    if (this.modifySceneForm === false) this.modifySceneForm = true
  }
  closeSceneForm(event: any) {
    console.log("closing")
    console.log("Scene created: ", event)
    if (event != undefined) {
      this.sceneAdded = true
      if (this.sceneList.length > 0 && event.priority !== undefined) {
        this.sceneList.splice(event.priority - 1, 0, event)
      } else {
        this.sceneList.push(event);
      }
      console.log(this.sceneList)
      this.time += event.time
    }
    if (this.sceneForm === true) this.sceneForm = false
    if (this.modifySceneForm === true) this.modifySceneForm = false

  }

  closeSceneFormModify(scene: any, index: number) {
    if (!scene || !index) {
      if (this.modifySceneForm === true) this.modifySceneForm = false
      if (this.sceneForm === true) this.sceneForm = false
    }
    if (this.time) {
      this.time += scene.time - this.sceneList[index].time
      this.sceneList[index] = scene
      this.sceneModified = true
      if (this.sceneForm === true) this.sceneForm = false
      if (this.modifySceneForm === true) this.modifySceneForm = false
      console.log("Scene Modified: ", scene, "INDICE: ", index)
    }

  }

  getSceneIndex(scene: any): number {
    return this.sceneList.indexOf(scene)
  }

  saveImageOpenstack(base64: string): Observable<string> {
    if (base64) {
      const data = {
        storage: '5',
        container: 'websmartcoast',
        base64: base64.split(',')[1]
      }

      return this.storageService
        .store(data)
        .pipe(
          map((response: any) => {
            console.log(response);
            return response.data[0].id
          }),
          catchError((error) => {
            console.error(error)
            return throwError(() => new Error('Failed to save image in Openstack'))
          })
        );
    } else {
      console.error('Failed to extract base64 data')
      return throwError(() => new Error('Failed to extract base64 data'))
    }
  }


  onSubmit(): boolean {
    let error = false

    if (this.sceneList && this.sceneList.length > 0) {
      const sceneObservables: Observable<any>[] = []

      Swal.fire({
        title: 'Loading',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      this.sceneList.map((scene) => {
        const properScene: Scene = {
          id: '',
          device_id: this.cameraId,
          name: scene.name,
          x: scene.x,
          y: scene.y,
          z: scene.z,
          image_id: '',
          apparitionTime: 30,
          isDefaultScene: false,
          type_id: 1
        }

        const saveImageObservable = this.saveImageOpenstack(scene.preview).pipe(
          tap((imageId) => {
            properScene.image_id = imageId
          })
        )

        const storeSceneObservable = saveImageObservable.pipe(
          switchMap(() => this.sceneService.store(properScene)),
          catchError((error) => {
            console.error(error)
            return throwError(() => new Error('Failed to store scene'))
          })
        )

        sceneObservables.push(storeSceneObservable)
      })

      forkJoin(sceneObservables)
        .pipe(
          switchMap((responses) => {
            console.log('Scene upload responses:', responses)
            error = responses.some((response) => response.code !== 200)

            let scenesId: number[] = []
            responses.forEach((res) => {
              console.log('ID SCENE:', res.data[0].id)
              scenesId.push(res.data[0].id)
            })

            this.sceneIds = scenesId

            const data = this.buildTask(scenesId)

            return this.buildMessageTask(data, this.sceneList).pipe(
              switchMap((message) => {
                const taskData = {
                  ...data,
                  message
                }

                return this.taskService.store(JSON.stringify(taskData))
              })
            )
          }),
          switchMap((res: any) => {
            const task: Task = res.data[0]
            delete task.hight_priority_task
            const task_id = res.data[0].id
            this.createdTask = task
            return this.buildMessageTask(task_id, this.sceneList).pipe(
              map((message) => {
                task.message = message
                return task
              }),
              switchMap((updatedTask) => this.taskService.update(task_id, updatedTask))
            )
          })
        )
        .subscribe((res) => {
          console.log(res)
          let scheduleData: Schedule = {
            id: '',
            active: this.createdTask.active,
            task_id: this.createdTask.id,
            description: this.createdTask.description,
            cron: '*/5 * * * *',
            delay: 0,
            start: this.firstForm.value.startDate + ' ' + this.firstForm.value.startTime + ':00',
            end: this.firstForm.value.endDate + ' ' + this.firstForm.value.endTime + ':00',
          }
          this.scheduleService.store(scheduleData).subscribe((res) => {
            console.log("Schedule: ", res)
            Swal.hideLoading(); // Hide the loading spinner
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            })

            Toast.fire({
              icon: 'success',
              title: 'Event added successfully'
            })
            this.taskService.events = {}
            this.taskService.cache = new Cache()
            this.router.navigate(['/events', this.cameraReference])
          })
        })
    }

    return error
  }

  buildTask(scenesId: number[]): Task {
    let message = {
      version: 2,
      time_send: 0,
      name: this.firstForm.value.name,
      task_id: 0,
      device_type: 'camera',
      device_reference: this.cameraReference,
      actions: null,
    }

    let task: Task = {
      id: '0',
      device_id: this.cameraId,
      name: this.firstForm.value.name,
      description: 'tarea de evento',
      message,
      retention_days: 60,
      active: this.firstForm.value.activated,
      priority: 1,
      public: false,
      version: 2,
      type_id: 7,
      scenes_id: scenesId, // meter ids de scena
      hight_priority_task: true
    }

    return task
  }

  buildMessageTask(taskId: any, scenesList: any): Observable<any> {
    const initStreamPromises: Promise<any>[] = []

    const actions: any[] = []
    scenesList.forEach((scene, sceneIndex) => {
      const initStreamPromise = this.initStream()
        .toPromise()
        .then((res) => {
          const moveAction = { name: 'move_to_scene', id: this.sceneIds[sceneIndex] }
          const waitAction = { name: 'wait', milliseconds: 1000 }
          const takePhotoAction = {
            name: 'take_photo_curl',
            reference: scene.name + '.jpeg',
            mediaprofile: 'Profile_1'
          }
          const waitFocusAction = { name: 'wait', milliseconds: scene.focusTime }
          const recordVideoAction = {
            name: 'record_video',
            reference: scene.name + '.mp4',
            mediaprofile: 'Profile_1',
            format: 'mp4',
            duration: scene.videoTime,
            source: res
          }
          const storageElementPhotoAction = {
            name: 'storage_element_on_catalog',
            reference: scene.name + '.jpeg'
          }
          const storageElementVideoAction = {
            name: 'storage_element_on_catalog',
            reference: scene.name + '.mp4'
          }
          actions.push(
            moveAction,
            waitAction,
            takePhotoAction,
            waitFocusAction,
            recordVideoAction,
            storageElementPhotoAction,
            storageElementVideoAction
          )
        })
        .catch((error) => {
          console.error(error)
          throw new Error('Failed to initialize stream')
        })

      initStreamPromises.push(initStreamPromise)
    })

    return forkJoin(initStreamPromises).pipe(
      map(() => {
        const message = {
          version: 2,
          time_send: 0,
          name: 'Event',
          task_id: taskId,
          device_type: 'camera',
          device_reference: this.cameraReference,
          actions
        }
        return message
      })
    )
  }

  initStream(): Observable<string> {
    let query = '[{"where":{"field":"description","operator":"like","data":"SD"}},{"orderByDesc":"created_at"}]'
    return this.cameraService.getStream(this.cameraId, 'plain/json', query).pipe(
      map((response: any) => {
        let stream = response.data[0]
        if (stream !== undefined) {
          this.stream = stream
          if (this.cameraReference === 'mandela' || this.cameraReference === 'cabotorres') {
            this.stream.data.video_url = this.stream.data.video_url.slice(0, -1) + '2'
          } else {
            this.stream.data.video_url = this.stream.data.video_url.slice(0, -1) + '3'
          }
        }
        return this.stream.url + this.stream.data.video_url
      })
    )
  }



  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.sceneList, event.previousIndex, event.currentIndex)
  }
  exit() {
    this.router.navigate(['/events', this.cameraReference])
  }
  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe()
  }

}
