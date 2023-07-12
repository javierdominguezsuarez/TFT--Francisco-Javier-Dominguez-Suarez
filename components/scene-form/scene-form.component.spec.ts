import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SceneFormComponent } from './scene-form.component';

describe('SceneFormComponent', () => {
  let component: SceneFormComponent;
  let fixture: ComponentFixture<SceneFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SceneFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SceneFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
