import { Component, OnDestroy, OnInit } from '@angular/core';
import { ScheduleService, TaskService } from '@camera-settings/services';
import { ActivatedRoute, Router } from '@angular/router';
import { CameraService } from '@shared/services';
import { Subscription } from 'rxjs';
import { Event } from '@events/models/events';


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit, OnDestroy {

  filter: String = "All"
  draft = false
  name: String = ""
  events: Event[]
  eventsFiltered: Event[]
  filtered: boolean = false
  cameraReference: string
  cameraId: number
  routeSubscription: Subscription
  taskSubscription: Subscription
  sceneSubscription: Subscription

  constructor(private route: ActivatedRoute, private taskService: TaskService, private cameraService: CameraService, private router: Router) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe(params => {
      this.cameraReference = params['cameraReference']
      console.log(this.cameraReference)
      this.getCameraId().then(() => {
        this.name = ""
        this.filter = ""
        this.filtered = false
        this.getEvents()
      })
    })

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

  async getEvents(): Promise<void> {

    const query = '[{"where":{"field":"device_id","operator":"eq","data":"' + this.cameraId + '"}}, {"where":{"field":"type_id","operator":"eq","data":"7"}}, {"orderByDesc": "created_at"}]'
    this.taskSubscription = this.taskService.getCached(this.cameraReference + this.draft, '', query)
      .subscribe(async res => {
        this.events = res
        console.log(res)

        this.events.map((res, index) => {
          this.sceneSubscription = this.taskService.getScenesCached(this.cameraReference, res.id, '', '').subscribe((eventScenes) => {
            if (eventScenes[0] != undefined) {
              this.events[index] = { ...this.events[index], ...eventScenes, scenePreview: '/storage/' + eventScenes[0].image_id.container + '/' + eventScenes[0].image_id.hash }
            } else {
              this.events[index] = { ...this.events[index], ...eventScenes, scenePreview: "assets/img/icons/noimage.png" }
            }
          }
          )
        })

      })


  }


  typeSearch(filter: String): void {
    this.filter = filter

    if (filter === "All") {
      this.draft = false
      this.updateEvents()
    } else {
      this.draft = true
      this.updateEvents()
    }


  }

  nameSearch(name: String): void {
    this.name = name
    this.updateEvents()

  }

  updateEvents(): void {
    console.log("DRAFT:",this.draft)
    if (this.draft === true){
      console.log("NAME:", this.name)
      if (this.name !== ''){
        this.eventsFiltered = this.events.filter((task) => task.active === false && task.name.toLowerCase().includes(this.name.toLowerCase()))
      }else {
        this.eventsFiltered = this.events.filter((task) => task.active === false)
      }
      
    }else{
      if (this.name !== ''){
        this.eventsFiltered = this.events.filter((task) =>  task.name.toLowerCase().includes(this.name.toLowerCase()))
      }else {
        this.eventsFiltered = this.events
      }
      
    }
    
    console.log(this.eventsFiltered)
    this.filtered = true

  }

  addEvent() {
    this.router.navigate(['/new'])
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) this.routeSubscription.unsubscribe()
    if (this.taskSubscription) this.taskSubscription.unsubscribe()
    if (this.sceneSubscription) this.sceneSubscription.unsubscribe()
  }

}
