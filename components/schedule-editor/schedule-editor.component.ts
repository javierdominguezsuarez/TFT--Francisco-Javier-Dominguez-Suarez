import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Schedule, Task } from '@camera-settings/models';
import { ScheduleService, TaskService } from '@camera-settings/services';
import { Scene } from '@shared/models';
import { forkJoin, tap } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-schedule-editor',
  templateUrl: './schedule-editor.component.html',
  styleUrls: ['./schedule-editor.component.scss']
})
export class ScheduleEditorComponent {
  form: FormGroup
  editInformation: any
  task: Task
  constructor(private router: Router, private taskService: TaskService, private scheduleService: ScheduleService, private formBuilder: FormBuilder, private dialogRef: MatDialogRef<ScheduleEditorComponent>) { }

  ngOnInit(): void {
    if (this.taskService.eventIdModify) {
      this.taskService.getEventEdition(this.taskService.eventIdModify).pipe(
        tap(([event, scenes, schedule]) => {
          const eventData: Task = event.data[0]
          this.task = eventData
          const scenesData: Scene[] = scenes.data
          const scheduleData: Schedule = schedule.data[0]
          this.editInformation = { eventData, scenesData, scheduleData }
          console.log({ eventData, scenesData, scheduleData })
        })
      ).subscribe(() => {
        this.form = this.formBuilder.group({
          name: [this.editInformation.eventData.name],
          startDate: [this.editInformation.scheduleData.join_data[0].start.split(" ")[0]],
          startTime: [this.editInformation.scheduleData.join_data[0].start.split(" ")[1]],
          endDate: [this.editInformation.scheduleData.join_data[0].end.split(" ")[0]],
          endTime: [this.editInformation.scheduleData.join_data[0].end.split(" ")[1]],
          activated: [false]
        })

      })
    } else {
      this.form = this.formBuilder.group({ name: '', startDate: '', startTime: '', endDate: '', endTime: '', activated: false })
    }

  }

  exit() {
    this.dialogRef.close(false)
  }

  submit() {
    console.log(this.form.value)
    Swal.fire({
      title: 'Loading',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })
    let schedule : Schedule = {
      id:this.editInformation.scheduleData.join_data[0].id,
      task_id: this.taskService.eventIdModify,
      start: this.form.value.startDate + ' ' + this.form.value.startTime,
      end: this.form.value.endDate + ' ' + this.form.value.endTime,
      active: this.form.value.activated,
      cron: '*/5 * * * *',
      delay: 0,
      description: this.editInformation.eventData.description
    }
    console.log("MODIFIED SCHEDULE: ",schedule)
    
    this.task.active = this.form.value.activated
    this.task.name = this.form.value.name
    delete this.task.hight_priority_task
    console.log("MODIFIED TASK: ",this.task)
    forkJoin([
      this.taskService.update(this.task.id, this.task),
      this.scheduleService.update(this.editInformation.scheduleData.join_data[0].id, schedule)
    ]).subscribe((res)=>{
        Swal.hideLoading()
        Swal.close()
        this.dialogRef.close(true)
        console.log(res)
      })

  }


}