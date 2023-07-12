import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-scene-card',
  templateUrl: './scene-card.component.html',
  styleUrls: ['./scene-card.component.scss']
})

export class SceneCardComponent {
  @Input() name: String
  @Input() picture: String
  @Input() id: number | string

}
