import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
  @Output() filterEvent = new EventEmitter<String>()

  onSelected(value : String){
    this.filterEvent.emit(value)
  }
}
