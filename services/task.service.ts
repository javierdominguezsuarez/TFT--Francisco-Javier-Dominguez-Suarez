import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '@models/response';
import { Task } from '@camera-settings/models';
import { forkJoin, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cache, singleEvents } from '../models/cache'
import { FileImg } from '@events/models/file';
import { Scene } from '@shared/models';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  currentTask: Task
  scenes: Scene[]
  events: singleEvents = {}
  eventIdModify: string
  dateFiles: { date: string, start: string, end: string } = { date: '', start: '', end: '' }
  cache: Cache = new Cache()
  filesInTask: Observable<Response>
  timeFilesInTask: number = 0
  constructor(private http: HttpClient) { }

  getCached(cameraReference, format, query): Observable<any> {
    format = format || 'plain/json'
    query = query || '[{"orderBy":"id"}]'

    const httpOptions = {
      params: new HttpParams().appendAll({ 'format': format, 'query': query }),
    }

    const url = environment.URL_API + '/api/v2/task'
    const currentTime = Date.now()

    if (this.events[cameraReference] && this.events[cameraReference].timeFetched + 300000 > currentTime) {
      console.log("CACHED EVENTS")
      return of(this.events[cameraReference].events)
    } else {
      console.log("NON CACHED EVENTS");
      return this.http.get<Response>(url, httpOptions).pipe(
        tap((response) => {
          this.events[cameraReference] = {
            events: response.data,
            timeFetched: currentTime
          }
        }),
        map((response) => response.data)
      )
    }
  }


  get(format, query): Observable<any> {
    format = format || 'plain/json'
    query = query || '[{"orderBy":"id"}]'

    const httpOptions = {
      params: new HttpParams().appendAll({ 'format': format, 'query': query }),
    };

    let url = environment.URL_API + '/api/v2/task';

    return this.http.get<Response>(url, httpOptions)
  }

  store(data: any): Observable<Response> {
    var url = environment.URL_API + '/api/v2/task';

    return this.http.post<Response>(url, data);
  }

  update(scene_id: any, data: any): Observable<Response> {
    var url = environment.URL_API + '/api/v2/task/' + scene_id;

    return this.http.put<Response>(url, data);
  }

  deleteEvent(id):Observable<Response>{
    var url = environment.URL_API + '/api/v2/task/' + id 
    return this.http.delete<Response>(url)
  }
  deleteScene(id,scene_id):Observable<Response>{
    var url = environment.URL_API + '/api/v2/task/' + id + '/' + scene_id ;
    return this.http.delete<Response>(url)
  }
  delete(scene_id: any): Observable<Response> {
    var url = environment.URL_API + '/api/v2/task/' + scene_id + '/0/0';

    return this.http.delete<Response>(url);
  }

  getSchedule(task_id, format: string, query: string): Observable<Response> {
    format = format || 'plain/json'
    query = query || '[{"orderBy":"id"}]'

    const httpOptions = {
      params: new HttpParams().appendAll({ 'format': format, 'query': query, 'join': true }),
    };

    let url = environment.URL_API + '/api/v2/task/' + task_id + '/schedule';

    return this.http.get<Response>(url, httpOptions)
  }

  getScene(task_id, format: string, query: string): Observable<Response> {
    format = format || 'plain/json'
    query = query || '[{"orderBy":"id"}]'

    const httpOptions = {
      params: new HttpParams().appendAll({ 'format': format, 'query': query, 'join': true }),
    };

    let url = environment.URL_API + '/api/v2/task/' + task_id + '/scene';

    return this.http.get<Response>(url, httpOptions)
  }

  getCurrentTask(): Task {
    return this.currentTask
  }

  setCurrentTask(task: Task): void {
    this.currentTask = task
  }


  getScenes(task_id, format, query): Observable<Response> {
    format = format || 'plain/json'
    query = query || '[{"orderBy":"id"}]'

    const httpOptions = {
      params: new HttpParams().appendAll({ 'format': format, 'query': query }),
    };  

    let url = environment.URL_API + '/api/v2/task/' + task_id + '/scene';

    return this.http.get<Response>(url, httpOptions)
  }

  getScenesCached(cameraReference, task_id, format, query): Observable<any> {
    format = format || 'plain/json'
    query = query || '[{"orderBy":"id"}]'
    const httpOptions = {
      params: new HttpParams().appendAll({ 'format': format, 'query': query }),
    }

    const url = environment.URL_API + '/api/v2/task/' + task_id + '/scene'


    const cachedScenes = this.cache.find(cameraReference, task_id)
    if (cachedScenes && Date.now() - cachedScenes.timeFetched < 300000) {
      return cachedScenes.scenes.pipe(map((response: any) => response.data))

    } else {
      console.log("NON CACHED SCENES")
      return this.http.get<Response>(url, httpOptions).pipe(
        tap((response) => {

          this.cache.add(cameraReference, task_id, of(response), Date.now())

        }),
        map((response) => response.data)
      )
    }

  }

  getFilesTask(task_id: number | string, refresh: boolean, format?: string, query?: any): Observable<any> {
    format = 'plain/json'
    const HTTP_OPTIONS = {
      params: new HttpParams().appendAll({ 'format': format, 'query': query }),
    };

    var url = environment.URL_API + '/api/v2/task/' + task_id + '/file';

    if (this.filesInTask && Date.now() - this.timeFilesInTask < 120000 && !refresh) {
      console.log("CACHED SCENES")
      return this.filesInTask.pipe(map((response: any) => response.data))
    } else {
      return this.http.get<Response>(url, HTTP_OPTIONS).pipe(
        tap((response) => {
          this.timeFilesInTask = Date.now()
          this.filesInTask = of(response)
        }),
        map((response) => response.data)
      )
    }

  }

  getEventEdition(task_id){
    const format =  'plain/json'
    const query = '[{"where":{"field":"id","operator":"eq","data":' + task_id + '}}]'
    const querySchedule = '[{"where":{"field":"task_id","operator":"eq","data":' + task_id + '}}]'
    const queryEmpty = '[{"orderBy":"id"}]'
    const schedule$ = this.getSchedule(task_id, format, querySchedule)
    const event$ = this.get(format, query)
    const scenes$ = this.getScenes(task_id, format, queryEmpty)

  return forkJoin([event$, scenes$, schedule$])
    
  }

}

