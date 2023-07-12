import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Response } from '@models/response';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CrudService<T> {

  constructor(private http: HttpClient, @Inject('endpoint') private endpoint: string) { }

  get(format: any, query: any): Observable<any> {
    format = format || 'plain/json'
    query = query || ''
    
    const httpOptions = {
      params: new HttpParams().appendAll({ 'format': format, 'query': query }),
    }

    let url = environment.URL_API +  '/api/v2/' + this.endpoint
    return this.http.get<any>(url, httpOptions)
  }


  store(data: T): Observable<Response> {
    var url = environment.URL_API + '/api/v2/' + this.endpoint
    return this.http.post<Response>(url, data)
  }

  update(id: any, data: T): Observable<Response> {
    var url = environment.URL_API + '/api/v2/' + this.endpoint + '/' + id
    return this.http.put<Response>(url, data)
  }

  delete(id: any): Observable<Response> {
    var url = environment.URL_API + '/api/v2/' + this.endpoint + '/' + id;
    return this.http.delete<Response>(url)
  }
}


