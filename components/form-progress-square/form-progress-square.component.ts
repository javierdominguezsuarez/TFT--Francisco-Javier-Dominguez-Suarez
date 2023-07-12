import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-progress-square',
  templateUrl: './form-progress-square.component.html',
  styleUrls: ['./form-progress-square.component.scss']
})
export class FormProgressSquareComponent {
  @Input() step: number
}
