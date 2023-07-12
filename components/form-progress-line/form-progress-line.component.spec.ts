import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProgressLineComponent } from './form-progress-line.component';

describe('FormProgressLineComponent', () => {
  let component: FormProgressLineComponent;
  let fixture: ComponentFixture<FormProgressLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormProgressLineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormProgressLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
