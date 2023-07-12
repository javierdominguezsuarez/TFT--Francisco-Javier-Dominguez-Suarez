import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Schedule, Task } from '@camera-settings/models';
import { ScheduleService, TaskService } from '@camera-settings/services';
import { Subject, Subscription, tap } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { FileImg } from '@events/models/file';
import { debounceTime } from 'rxjs/operators';
import { Scene } from '@shared/models';
import { SceneService } from '@shared/services';

@Component({
  selector: 'app-scene-view',
  templateUrl: './scene-view.component.html',
  styleUrls: ['./scene-view.component.scss']
})
export class SceneViewComponent {

  // Flags
  switch: boolean = false

  // Database Data
  cameraReference: number | string
  event: number | string
  scene: Scene
  id: number | string
  imagesMini: FileImg[]
  imagesMap: Map<FileImg, FileImg>
  task: Task
  schedule: Schedule

  // Video
  videos: FileImg[]


  // Pagination
  imagesPaginated: FileImg[]
  pageIndex: number
  pageSize: number
  length: number
  videosPaginated: FileImg[]
  pageIndexVideo: number
  pageSizeVideo: number
  lengthVideo: number

  // Subscriptions
  routeParamSubscription: Subscription
  routeParentsParamSubscription: Subscription
  imagesSubscription: Subscription
  dateSubscription: Subscription
  videosSubscription: Subscription

  // Filters control
  filterSubject = new Subject<void>()

  // Initial Value Filters
  date: string = ""
  startHour: null | string = ""
  endHour: null | string = ""

  constructor(private route: ActivatedRoute, private router: Router, private sceneService: SceneService, private taskService: TaskService, private scheduleService: ScheduleService) { }

  ngOnInit() {
    this.filterSubject.pipe(debounceTime(1000)).subscribe(() => {
      this.getFiles(true)
    })

    this.routeParamSubscription = this.route.params.subscribe(params => {
      this.event = params['id']
      this.id = params['sceneId']
      console.log(this.id)
    })

    this.routeParentsParamSubscription = this.route.parent.params.subscribe(parentParams => {
      this.cameraReference = parentParams['cameraReference']
    })

    this.getScene()
    this.getEvent()
  }

  getScene(): void {
    const query = '[{"where":{"field":"id","operator":"eq","data":' + this.id + '}}]'
    this.sceneService.get('', query).toPromise().then(
      res => {
        this.scene = res.data[0]
        console.log(res.data[0])
      }
    )

  }

  getFiles(refresh: boolean): void {
    if (!this.switch) {
      this.getImages(refresh)
    } else {
      this.getVideos(refresh)
    }
  }

  formatName(name: string): string {
    return name.toLowerCase().replaceAll(" ", "_")
  }
  getImages(refresh: boolean) {
    this.imagesMini = null
    this.imagesMap = null
    this.imagesPaginated = null
    const itemQuery =
      '[{"where":[{"where":{"field":"file.name","operator":"like","data":"' +this.formatName(this.scene.name)+ "%" + '_min.jpeg"}},' +
      '{"orWhere":{"field":"file.name","operator":"like","data":"' + this.formatName(this.scene.name)+ "%" + '.jpeg"}}]},' +
      '{"where":{"field":"job.created_at","operator":">","data":"' + this.date + ' ' + this.startHour + '"}},' +
      '{"where":{"field":"job.created_at","operator":"<","data":"' + this.date + ' ' + this.endHour + '"}},{"orderBy":"job.created_at"}]'




    this.imagesSubscription = this.taskService.getFilesTask(this.event, refresh, '', itemQuery).subscribe((images) => {
      const imagesMap = new Map()
      const numImages = images.length

      for (let i = 0; i < numImages; i += 2) {
        if (i + 1 >= numImages) {
          break;
        }

        const minImage = images[i]
        const fullImage = images[i + 1]
        imagesMap.set(minImage, fullImage)
      }
      console.log(imagesMap)
      this.imagesMap = imagesMap
      this.imagesMini = Array.from(imagesMap.keys())


      this.pageIndex = 0
      this.pageSize = 20
      this.updatePaginator(this.pageIndex, this.pageSize)
      this.length = this.imagesMini.length
      console.log(this.imagesMini)
    })

  }
  getEvent() {
    const query = '[{"where":{"field":"id","operator":"eq","data":' + this.event + '}}]'
    this.taskService.get('', query).toPromise()
      .then(res => {
        this.task = res.data[0]
        const query = '[{"where":{"field":"task_id","operator":"eq","data":' + this.event + '}}]'
        this.scheduleService.get('', query).toPromise()
          .then(res => {
            this.schedule = res.data[0]
            const start = new Date(Date.parse(res.data[0].start.replace(" ", "T")))
            const end = new Date(start.getTime() + (2 * 60 * 60 * 1000))
            this.date = start.toISOString().split("T")[0]
            this.startHour = start.toISOString().split("T")[1].substr(0, 8)
            this.endHour = end.toISOString().split("T")[1].substr(0, 8)
            this.taskService.dateFiles = {date: this.date, start: this.startHour, end : this.endHour}
            this.getFiles(true)
          })
      })
  }

  onTimeStartChange(hour: string) {
    this.startHour = hour
    console.log('Selected  Start time: ', this.startHour)
    this.filterSubject.next()
  }

  onTimeEndChange(hour: string) {
    this.endHour = hour
    console.log('Selected  End time: ', this.endHour)
    this.filterSubject.next()

  }

  onDateChange(date: string) {
    this.date = date
    console.log('Selected date: ', this.date)
    this.filterSubject.next()
  }

  onSelectedOption(option: string) {
    if (option == "Image" && this.switch != false) {
      this.switch = false
    } else {
      if (this.switch != true && option == "Video") {
        this.switch = true
        this.getVideos(true)
      }
    }
    console.log(this.switch)
  }
  pageChanged(event: PageEvent) {
    this.pageIndex = event.pageIndex
    this.pageSize = event.pageSize
    this.updatePaginator(this.pageIndex, this.pageSize)
  }

  updatePaginator(pageIndex: number, pageSize: number) {
    const startIndex = pageIndex * pageSize
    const endIndex = startIndex + pageSize
    this.imagesPaginated = this.imagesMini.slice(startIndex, endIndex)
  }

  getVideos(refresh: boolean) {
    console.log("getting VIDEOS")
    this.videos = null
    const itemQuery =
      '[{"where":[{"where":{"field":"file.name","operator":"like","data":"' + this.formatName(this.scene.name)+ "%"  + '.mp4"}}]},' +
      '{"where":{"field":"job.created_at","operator":">","data":"' + this.date + ' ' + this.startHour + '"}},' +
      '{"where":{"field":"job.created_at","operator":"<","data":"' + this.date + ' ' + this.endHour + '"}},{"orderBy":"job.created_at"}]'

    this.videosSubscription = this.taskService.getFilesTask(this.event, refresh, '', itemQuery).subscribe((videos) => {

      this.videos = videos

      this.pageIndexVideo = 0
      this.pageSizeVideo = 20
      this.updatePaginatorVideo(this.pageIndexVideo, this.pageSizeVideo)
      this.lengthVideo = this.videos.length
      console.log(this.videos)
    })

  }

  getVideoName(video: FileImg): string {
    const date = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 12)
    return this.event + "_" + video.name.split(".")[0] + "_" + date + ".mp4"
  }

  pageChangedVideo(event: PageEvent) {
    this.pageIndexVideo = event.pageIndex
    this.pageSizeVideo = event.pageSize
    this.updatePaginatorVideo(this.pageIndexVideo, this.pageSizeVideo)
  }

  updatePaginatorVideo(pageIndex: number, pageSize: number) {
    const startIndex = pageIndex * pageSize
    const endIndex = startIndex + pageSize
    this.videosPaginated = this.videos.slice(startIndex, endIndex)
    console.log("updated-videos")
  }

  exit() {
    this.router.navigate(['/events', this.cameraReference, this.event])
  }

  ngOnDestroy(): void {
    this.routeParamSubscription.unsubscribe()
    this.routeParentsParamSubscription.unsubscribe()
    this.imagesSubscription.unsubscribe()
  }
}
