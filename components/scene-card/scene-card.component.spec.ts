import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SceneCardComponent } from './scene-card.component';

describe('SceneCardComponent', () => {
  let component: SceneCardComponent;
  let fixture: ComponentFixture<SceneCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SceneCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SceneCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
