import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '@camera-settings/models';
import { ScheduleService, TaskService } from '@camera-settings/services';
import { Schedule } from '@events/models/schedule';
import { Observable, Subscription, forkJoin, from, mergeMap, of, tap } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Scene } from '@shared/models';
import Swal from 'sweetalert2';
import { Cache } from '@camera-settings/models/cache';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ScheduleEditorComponent } from '../schedule-editor/schedule-editor.component';
import { SceneService } from '@shared/services';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.scss'],
  providers: [DatePipe]
})
export class EventViewComponent {

  task: Task
  id: string
  schedule: Schedule
  duplicateEventInformation: any
  scenes: Scene[]
  scenesId:  number  []
  cameraReference: String
  menuDisplayed: Boolean
  routeParamsSubscription: Subscription
  routeParentsParamsSubscription: Subscription


  constructor(private route: ActivatedRoute, private taskService: TaskService, private router: Router, private scheduleService: ScheduleService, private dialog: MatDialog,private sceneService: SceneService) { }

  ngOnInit() {
    this.menuDisplayed = false
    this.routeParamsSubscription = this.route.params.subscribe(params => {
      this.id = params['id']
      const query = '[{"where":{"field":"id","operator":"eq","data":' + this.id + '}}]'
      this.taskService.get('', query).toPromise()
        .then(res => {
          this.task = res.data[0]
          console.log(this.task)
          const query = '[{"where":{"field":"task_id","operator":"eq","data":' + this.id + '}}]'
          this.scheduleService.get('', query).toPromise()
            .then(res => {
              this.schedule = res.data[0]
              console.log(this.schedule)
            })
          this.taskService.getScenes(this.task.id, '', '').toPromise()
            .then(res => {
              this.scenes = res.data
            })
        })

      this.routeParentsParamsSubscription = this.route.parent.params.subscribe(parentParams => {
        this.cameraReference = parentParams['cameraReference']
      })
    })
  }

  exit() {
    this.router.navigate(['/events', this.cameraReference])
  }
  menu(event: MouseEvent) {
    event.stopImmediatePropagation()
    console.log(" menu a true")
    this.menuDisplayed = true
  }
  closeMenu() {
    console.log("menu a false")
    if (this.menuDisplayed) this.menuDisplayed = false
  }
  edit() {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.width = '800px'
    dialogConfig.height = '800px'
    this.taskService.eventIdModify = this.id
    const dialogRef = this.dialog.open(ScheduleEditorComponent, dialogConfig)
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.taskService.events = {}
        this.taskService.cache = new Cache()
        this.router.navigate(['/events', this.cameraReference])
      }
    })
  }
  remove() {
    Swal.fire({
      title: 'Eliminar evento',
      text: '¿Estás seguro?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Acción aceptada');
        Swal.fire({
          title: 'Loading',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading()
            // Hay que modificar para eliminar eventos en el backend 
            this.deleteScenesAndEvent().subscribe(() => {
              Swal.close()
              this.taskService.events = {}
              this.taskService.cache = new Cache()
              this.router.navigate(['/events', this.cameraReference])
            })
          }
        })
      } else {
        console.log('Acción cancelada')
      }
    })
  }
  deleteScenes() {
    const deleteObservables = this.scenes.map(id => {
      return this.taskService.deleteScene(this.id, id)
    })

    return forkJoin(deleteObservables)
  }

  deleteScenesAndEvent() {
    const deleteSceneObservable = this.deleteScenes()
    const deleteEventObservable = this.taskService.deleteEvent(this.id)

    return forkJoin([deleteSceneObservable, deleteEventObservable])
  }

  duplicate() {
    this.taskService.getEventEdition(this.id).pipe(
      tap(([event, scenes, schedule]) => {
        const eventData: Task = event.data[0]
        const scenesData: Scene[] = scenes.data
        const scheduleData: Schedule = schedule.data[0]
        this.duplicateEventInformation = { eventData, scenesData, scheduleData }
  
        Swal.fire({
          title: 'Introduce a name',
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonColor: '#0078B2',
          cancelButtonColor: '#9C9C9C',
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          showLoaderOnConfirm: true,
          preConfirm: (name) => {
            console.log(name)
            console.log(this.duplicateEventInformation)
  
            const storeSceneObservables: Observable<any>[] = this.duplicateEventInformation.scenesData.map((scene) => {
              const properScene: Scene = {
                id: '',
                device_id: scene.device_id,
                name: scene.name,
                x: scene.x,
                y: scene.y,
                z: scene.z,
                image_id: '',
                apparitionTime: 30,
                isDefaultScene: false,
                type_id: 1
              }
  
              console.log('Scene to store:', properScene)
              return this.sceneService.store(properScene)
            })
  
            forkJoin(storeSceneObservables).subscribe((responses) => {
              console.log(responses)
  
              const scenesId: number[] = responses.map((res) => res.data[0].id)
              this.scenesId = scenesId
              this.duplicateEventInformation.eventData.id = '0'
              this.taskService.store(this.duplicateEventInformation.eventData.id = '0').subscribe( )
              // Continuar con las instrucciones restantes
              // Crear las escenas
              // Crear la tarea
              // Realizar la solicitud PUT con la tarea recibida y el nombre
              // Crear el cronograma
              // Agregar las escenas a la tarea
              // Navegar a la página de eventos
            })
          },
          allowOutsideClick: () => !Swal.isLoading()
        })
      })
    ).subscribe()
  }
  
  

  ngOnDestroy(): void {
    this.routeParamsSubscription.unsubscribe()
    this.routeParentsParamsSubscription.unsubscribe()
  }
  formatDate(date: any) {
    return new Date(Date.parse(date.replace(" ", "T")))
  }

}
