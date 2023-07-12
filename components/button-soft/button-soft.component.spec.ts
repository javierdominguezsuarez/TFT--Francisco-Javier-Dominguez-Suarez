import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonSoftComponent } from './button-soft.component';

describe('ButtonSoftComponent', () => {
  let component: ButtonSoftComponent;
  let fixture: ComponentFixture<ButtonSoftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonSoftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonSoftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
