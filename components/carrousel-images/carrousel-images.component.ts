import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Schedule, Task } from '@camera-settings/models';
import { ScheduleService, TaskService } from '@camera-settings/services';
import { FileImg } from '@events/models/file';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-carrousel-images',
  templateUrl: './carrousel-images.component.html',
  styleUrls: ['./carrousel-images.component.scss']
})
export class CarrouselImagesComponent {

  routeParamSubscription: Subscription
  routeParentsParamSubscription: Subscription
  imagesSubscription: Subscription
  event: number
  id: number | string
  cameraReference: number | string
  hash: string
  mainImage: FileImg
  imagesMini: FileImg[]
  imagesFull: FileImg[]
  imagesMap: Map<FileImg, FileImg>
  date: string = ""
  startHour: null | string = ""
  endHour: null | string = ""

  constructor(private route: ActivatedRoute, private taskService: TaskService, private router: Router) { }

  ngOnInit() {
    this.routeParamSubscription = this.route.params.subscribe(params => {
      this.event = params['id']
      this.id = params['sceneId']
      this.hash = params['imgId']
      console.log(this.hash)
    })
    this.routeParentsParamSubscription = this.route.parent.params.subscribe(parentParams => {
      this.cameraReference = parentParams['cameraReference']
    })
    if (!this.imagesMap) {
      this.date = this.taskService.dateFiles.date
      this.startHour = this.taskService.dateFiles.start
      this.endHour = this.taskService.dateFiles.end
      this.getImages()
    }

  }


  getImages() {
    const itemQuery =
      '[{"where":[{"where":{"field":"file.name","operator":"like","data":"' + "scene.name" + "%" + '_min.jpeg"}},' +
      '{"orWhere":{"field":"file.name","operator":"like","data":"' + "scene.name" + "%" + '.jpeg"}}]},' +
      '{"where":{"field":"job.created_at","operator":">","data":"' + this.date + ' ' + this.startHour + '"}},' +
      '{"where":{"field":"job.created_at","operator":"<","data":"' + this.date + ' ' + this.endHour + '"}},{"orderBy":"job.created_at"}]'
    this.imagesSubscription = this.taskService.getFilesTask(this.event, false, '', itemQuery).subscribe((images) => {
      const imagesMap = new Map()
      const numImages = images.length

      for (let i = 0; i < numImages; i += 2) {
        if (i + 1 >= numImages) {
          break;
        }

        const minImage = images[i]
        const fullImage = images[i + 1]
        var preload = new Image()
        preload.src = '/storage/' + images[i + 1].container + '/' + images[i + 1].hash
        if (images[i].hash === this.hash) this.mainImage = fullImage
        imagesMap.set(minImage, fullImage)
      }
      console.log(this.mainImage)
      console.log(imagesMap)
      this.imagesMap = imagesMap
      this.imagesMini = Array.from(imagesMap.keys())
      this.imagesFull = Array.from(imagesMap.values())
    })
  }



  nextImage() {
    const currentIndex = this.imagesFull.indexOf(this.mainImage)
    const nextIndex = (currentIndex + 1) % this.imagesFull.length
    this.mainImage = this.imagesFull[nextIndex]
  }

  previousImage() {
    const currentIndex = this.imagesFull.indexOf(this.mainImage)
    const previousIndex = currentIndex > 0 ? (currentIndex - 1) % this.imagesFull.length : this.imagesFull.length - 1
    this.mainImage = this.imagesFull[previousIndex]
  }

  downloadImage() {
    const imageUrl = '/storage/' + this.mainImage.container + '/' + this.mainImage.hash
    const link = document.createElement('a')
    const date = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 12)
    link.href = imageUrl
    link.download = this.event + "_" + this.mainImage.name.split(".")[0] + "_" + date + ".jpeg"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }


  exit() {
    this.router.navigate(['/events', this.cameraReference, this.event, 'scene', this.id])
  }

  ngOnDestroy(): void {
    this.routeParamSubscription.unsubscribe()
    this.routeParentsParamSubscription.unsubscribe()
    this.imagesSubscription.unsubscribe()

  }
}
