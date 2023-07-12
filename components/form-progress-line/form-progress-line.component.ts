import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-progress-line',
  templateUrl: './form-progress-line.component.html',
  styleUrls: ['./form-progress-line.component.scss']
})
export class FormProgressLineComponent {
  @Input() step: number
  @Input() title: string
}
