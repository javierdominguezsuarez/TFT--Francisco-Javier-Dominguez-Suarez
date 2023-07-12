import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeBoxComponent } from './time-box.component';

describe('TimeBoxComponent', () => {
  let component: TimeBoxComponent;
  let fixture: ComponentFixture<TimeBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
