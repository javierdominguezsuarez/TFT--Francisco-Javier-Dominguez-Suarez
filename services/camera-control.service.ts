import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '@models/response';
import { BehaviorSubject, Observable, Subject, Subscription, interval } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CameraControlService {
  currentSession: any
  currentVel: number = 4
  endTime: Date
  remainingTime: BehaviorSubject<number> = new BehaviorSubject<number>(0)
  countdownSubscription: Subscription | undefined
  private cameraMode = new Subject<'manual' | 'auto'>()

  constructor(private http: HttpClient) { }

  startCountdown(duration: number): void {
    this.endTime = new Date(Date.now() + duration)
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe()
    }

    this.countdownSubscription = interval(1000).subscribe(() => {
      if (!this.endTime) {
        return
      }
      const remainingTime = this.endTime.getTime() - Date.now()
      if (remainingTime <= 0) {
        this.remainingTime.next(0)
        this.countdownSubscription?.unsubscribe()
        this.endTime = null
        this.removeSession(this.currentSession.id).toPromise().then(() => {
          this.currentSession = ''
        })
        return
      }
      this.remainingTime.next(remainingTime)
    })
  }

  getRemainingTime(): BehaviorSubject<number> {
    return this.remainingTime
  }

  cancelCountdown(): void {
    this.endTime = null
    this.remainingTime.next(0)
  }



  getSession(id: number): Observable<any> {
    let url = environment.URL_API + '/api/v2/session/' + id;

    return this.http.post<any>(url, null)
  }

  removeSession(id: any): Observable<any> {
    let url = environment.URL_API + '/api/v2/session/' + id + '/stop';

    return this.http.put<any>(url, null)
  }

  moveCamera(name: string, x: number, y: number, z: number, idSession: number) {
    let url = environment.URL_API + '/api/v2/session/' + idSession + '/action/App//Models//Message//v1//Actions//continuous_move';
    let action = {
      name: name,
      x: (x / 10).toString(),
      y: (y / 10).toString(),
      z: (z / 10).toString(),
      'mediaprofile': 'Profile_1'
    };

    this.http.post(url, action).toPromise()
    // .then(res => console.log(res))
    // .catch(res => console.log(res));
  }

  move(name: string, z: number, idSession: number) {
    let url = environment.URL_API + '/api/v2/session/' + idSession + '/action/App//Models//Message//v1//Actions//move';
    let action = {
      name: name,
      z: z.toString(),
      'mediaprofile': 'Profile_1'
    };

    this.http.post(url, action).toPromise()
    // .then(res => console.log(res))
    // .catch(res => console.log(res));
  }

  stopCamera(name: string, idSession: number) {
    var url = environment.URL_API + '/api/v2/session/' + idSession + '/action/App//Models//Message//v1//Actions//stop_move';
    var action = {
      name: name,
      x: '0',
      y: '0',
      z: '0',
      'mediaprofile': 'Profile_1'
    };

    this.http.post(url, action).toPromise()
    // .then(res => console.log(res))
    // .catch(res => console.log(res));
  }

  getPosition(idSession): Observable<Response> {
    let url = environment.URL_API + '/api/v2/session/' + idSession + '/action/App//Models//Message//v1//Actions//get_position'

    return this.http.post<Response>(url, null)
  }

  wiper(idSession: any) {
    let url = environment.URL_API + '/api/v2/session/' + idSession + '/action/App//Models//Message//v1//Actions//wiper';

    this.http.post(url, null).toPromise()
  }

  sendWiper(device_id): Observable<Response> {
    let url = environment.URL_API + '/api/v2/task/wiper/' + device_id;

    return this.http.post<Response>(url, null)
  }

  onCameraMode(): Observable<'manual' | 'auto'> {
    return this.cameraMode.asObservable()
  }

  setCameraMode(mode: 'manual' | 'auto'): void {
    this.cameraMode.next(mode)
  }
  zoomToSector(idSession,action): Observable<Response>{
    let url = environment.URL_API + '/api/v2/session/' + idSession + '/action/App//Models//Message//v2//Actions//camera//zoom_to_sector'
    return this.http.post<Response>(url,action)

 }
}