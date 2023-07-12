import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SceneAdderComponent } from './scene-adder.component';

describe('SceneAdderComponent', () => {
  let component: SceneAdderComponent;
  let fixture: ComponentFixture<SceneAdderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SceneAdderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SceneAdderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
