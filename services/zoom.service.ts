import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ZoomService {

  constructor(private http: HttpClient) { }

 zoom(cameraName: string, functionName: string, data: any[], url: string): void {
    const postdata = {
      camera_name: cameraName,
      function_name: functionName,
      data: data
    }
    this.http.post(url, postdata).subscribe({
      next: (response: any) => {
        console.log(`Status Code: ${response.status}, Response:`, response)
      },
      error: (error: any) => {
        console.error('An error occurred:', error)
      }
    })
  }
}
