import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss']
})
export class CustomSelectComponent {

    @Input() placeholder: string
    @Input() options: string[]
    @Output() selectedOptionEvent = new EventEmitter<string>()

    
    onSelectedOption(value : string){
      this.selectedOptionEvent.emit(value)
    }
}
