import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShadowLoaderComponent } from './shadow-loader.component';

describe('ShadowLoaderComponent', () => {
  let component: ShadowLoaderComponent;
  let fixture: ComponentFixture<ShadowLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShadowLoaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShadowLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
