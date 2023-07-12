import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-time-box',
  templateUrl: './time-box.component.html',
  styleUrls: ['./time-box.component.scss']
})
export class TimeBoxComponent {
  @Input() time: string | undefined
  @Input() totalTime: string | undefined
  
  getProgressPercentage(): number {
      if (this.time && this.totalTime){
          if (parseInt(this.totalTime) === 0) {
      return 0
    }
    return (parseInt(this.time) / parseInt(this.totalTime)) * 100
      }else {
          return 0
      }
  }
  getProgressScale(): string {
      if(this.time && this.totalTime){
          const progress = parseInt(this.time) / parseInt(this.totalTime)
          return `scaleX(${progress})`
      }
      return ""

    }
    formatTime(time: string): string {
      const totalSeconds = parseInt(time)
      const minutes = Math.floor(totalSeconds / 60)
      const seconds = totalSeconds % 60
    
      const formattedMinutes = minutes.toString().padStart(2, '0')
      const formattedSeconds = seconds.toString().padStart(2, '0')
    
      return `${formattedMinutes}:${formattedSeconds}`
    }
        
}
