import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgOptimizedImage } from '@angular/common'
import { EventsRoutingModule } from './events-routing.module';
import { EventsComponent } from './components/events/events.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { ButtonComponent } from './components/button/button.component';
import { FilterComponent } from './components/filter/filter.component';
import { EventCardComponent } from './components/event-card/event-card.component';
import { EventViewComponent } from './components/event-view/event-view.component';
import { RouterModule } from '@angular/router';
import { EventFormComponent } from './components/event-form/event-form.component';
import { FormProgressSquareComponent } from './components/form-progress-square/form-progress-square.component';
import { SceneCardComponent } from './components/scene-card/scene-card.component';
import { SceneViewComponent } from './components/scene-view/scene-view.component';
import { JobFileService, JobService } from './services/job.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { ShadowLoaderComponent } from './components/shadow-loader/shadow-loader.component';
import { CarrouselImagesComponent } from './components/carrousel-images/carrousel-images.component';
import { CustomSelectComponent } from './components/custom-select/custom-select.component';
import { ButtonNegativeComponent } from './components/button-negative/button-negative.component';
import { ValidationFormModule } from "../validation-form/validation-form.module";
import { SceneAdderComponent } from './components/scene-adder/scene-adder.component';
import { ToasterComponent } from './components/toaster/toaster.component';
import { SceneFormComponent } from './components/scene-form/scene-form.component';
import { FormProgressLineComponent } from './components/form-progress-line/form-progress-line.component';
import { CameraControlV2Component } from './components/camera-control-v2/camera-control-v2.component';
import { MatSliderModule } from '@angular/material/slider';
import { CropperComponent } from './components/cropper/cropper.component';
import { ButtonSoftComponent } from './components/button-soft/button-soft.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TimeBoxComponent } from './components/time-box/time-box.component';
import { ScheduleEditorComponent } from './components/schedule-editor/schedule-editor.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    declarations: [
        EventsComponent,
        SearchBarComponent,
        ButtonComponent,
        FilterComponent,
        EventCardComponent,
        EventViewComponent,
        EventFormComponent,
        FormProgressSquareComponent,
        SceneCardComponent,
        SceneViewComponent,
        SpinnerComponent,
        ShadowLoaderComponent,
        CarrouselImagesComponent,
        CustomSelectComponent,
        ButtonNegativeComponent,
        SceneAdderComponent,
        ToasterComponent,
        SceneFormComponent,
        FormProgressLineComponent,
        CameraControlV2Component,
        CropperComponent,
        ButtonSoftComponent,
        TimeBoxComponent,
        ScheduleEditorComponent,


    ],
    providers: [
        // Aquí añadimos los valores de los endpoints que necesitemos inyectar en los servicios
        { provide: 'job', useValue: 'job' },
        { provide: 'job_file', useValue: 'job_file' },
        JobService,
        JobFileService
    ],
    imports: [
        CommonModule,
        RouterModule,
        EventsRoutingModule,
        NgOptimizedImage,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatPaginatorModule,
        ReactiveFormsModule,
        FormsModule,
        MatSelectModule,
        ValidationFormModule,
        MatSliderModule,
        DragDropModule,
        MatDialogModule
    ]
})
export class EventsModule { }
