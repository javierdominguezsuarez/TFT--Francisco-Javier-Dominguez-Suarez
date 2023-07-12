import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button-negative',
  templateUrl: './button-negative.component.html',
  styleUrls: ['./button-negative.component.scss']
})
export class ButtonNegativeComponent {
  @Input() text : String
}
