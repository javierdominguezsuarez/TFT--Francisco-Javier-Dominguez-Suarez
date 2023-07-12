import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent {
  @Input() name: String
  @Input() picture: String
  @Input() id: number | string
  @Input() state: String

}
