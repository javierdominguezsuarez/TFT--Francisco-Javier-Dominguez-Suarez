import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrouselImagesComponent } from './carrousel-images.component';

describe('CarrouselImagesComponent', () => {
  let component: CarrouselImagesComponent;
  let fixture: ComponentFixture<CarrouselImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarrouselImagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarrouselImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
