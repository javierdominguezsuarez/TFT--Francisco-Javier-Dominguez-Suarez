import { Component, Input } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {

  @Input() text: String
  @Input() routerLink: string[]
}
