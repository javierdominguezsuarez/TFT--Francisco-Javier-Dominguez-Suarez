import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsComponent } from './components/events/events.component';
import { EventViewComponent } from './components/event-view/event-view.component';
import { EventFormComponent } from './components/event-form/event-form.component';
import { SceneViewComponent } from './components/scene-view/scene-view.component';
import { CarrouselImagesComponent } from './components/carrousel-images/carrousel-images.component';

const routes: Routes = [
  {
    path: '', component: EventsComponent
  },
  {
    path: 'new', component: EventFormComponent
  },
  {
    path: 'new/:id', component: EventFormComponent
  },
  {
    path: ':id', component: EventViewComponent,
  },
  {
    path: ':id/scene/:sceneId',
    component: SceneViewComponent
  },
  {
    path: ':id/scene/:sceneId/img/:imgId',
    component: CarrouselImagesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
