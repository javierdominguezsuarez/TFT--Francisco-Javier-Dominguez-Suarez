import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  @Input() text : String 
  @Output() searchEvent = new EventEmitter<String>()

  addSearch(value : String){  
    this.searchEvent.emit(value)
  }
}
