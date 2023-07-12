import { Observable } from "rxjs"
import { Response } from '@models/response';

interface Events {
  [cameraReference: number]: {
    [id: number | string]: {
      scenes: Observable<Response>,
      timeFetched: number
    }
  }
}
export interface singleEvents {
  [cameraReference: string | number]: { events: any[], timeFetched: number }
}


export class Cache {
  private events: Events = {}

  add(cameraReference: number, id: number | string, scenes: Observable<Response>, timeFetched: number): void {
    if (!this.events[cameraReference]) {
      this.events[cameraReference] = {}
    }

    this.events[cameraReference][id] = {
      scenes: scenes,
      timeFetched: timeFetched
    }
  }

  update(cameraReference: number, id: number | string, scenes: Observable<Response>, timeFetched: number): void {
    if (this.events[cameraReference] && this.events[cameraReference][id]) {
      this.events[cameraReference][id] = {
        scenes: scenes,
        timeFetched: timeFetched
      }
    }
  }

  remove(cameraReference: number, id: number | string): void {
    if (this.events[cameraReference]) {
      delete this.events[cameraReference][id]

      if (Object.keys(this.events[cameraReference]).length === 0) {
        delete this.events[cameraReference]
      }
    }
  }

  find(cameraReference: number, id: number | string): any {
    return {
      scenes: this.events[cameraReference]?.[id]?.scenes,
      timeFetched: this.events[cameraReference]?.[id]?.timeFetched
    }
  }
}
