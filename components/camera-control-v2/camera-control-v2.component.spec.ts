import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraControlV2Component } from './camera-control-v2.component';

describe('CameraControlV2Component', () => {
  let component: CameraControlV2Component;
  let fixture: ComponentFixture<CameraControlV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CameraControlV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CameraControlV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
