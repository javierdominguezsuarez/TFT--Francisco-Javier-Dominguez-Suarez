import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudService } from './crud.service';


@Injectable({
  providedIn: 'root'
})
export class JobService extends CrudService<any> {

  constructor(http: HttpClient,@Inject('job') job: string) {
    super(http, job)
  }

}
@Injectable({
  providedIn: 'root'
})
export class JobFileService extends CrudService<any> {

  constructor(http: HttpClient,@Inject('job_file') job_file: string) {
    super(http, job_file)
  }

}