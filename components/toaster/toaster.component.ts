import { Component, Input } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss']
})
export class ToasterComponent {
  @Input() message : string 
  @Input() icon : string 
  iconMap: { [key: string]: SweetAlertIcon } = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info',
    question: 'question'
  }

  ngOnInit():void{
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    Toast.fire({
      icon:  this.iconMap[this.icon] ,
      title: this.message,
    })
  }
}
