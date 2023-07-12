import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonNegativeComponent } from './button-negative.component';

describe('ButtonNegativeComponent', () => {
  let component: ButtonNegativeComponent;
  let fixture: ComponentFixture<ButtonNegativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonNegativeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonNegativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
