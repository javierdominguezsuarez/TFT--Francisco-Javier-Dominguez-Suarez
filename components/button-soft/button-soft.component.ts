import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button-soft',
  templateUrl: './button-soft.component.html',
  styleUrls: ['./button-soft.component.scss']
})
export class ButtonSoftComponent {
  @Input() text: String
}
