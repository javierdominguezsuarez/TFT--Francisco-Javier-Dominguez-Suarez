import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Scene } from '@shared/models';

@Component({
  selector: 'app-scene-adder',
  templateUrl: './scene-adder.component.html',
  styleUrls: ['./scene-adder.component.scss']
})
export class SceneAdderComponent {
  scenes: Scene[] = []

  @Input() sceneList:any[]
  @Output() open = new EventEmitter()

  ngOnInit() {
    this.scenes = this.sceneList
    console.log("SCENES SCENE ADDER:", this.scenes)
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['sceneList']) {
      this.scenes = [...this.sceneList]
      console.log("HERE", this.scenes)
    }
  }
} 
