import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProgressSquareComponent } from './form-progress-square.component';

describe('FormProgressSquareComponent', () => {
  let component: FormProgressSquareComponent;
  let fixture: ComponentFixture<FormProgressSquareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormProgressSquareComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormProgressSquareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
