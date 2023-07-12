import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { EventViewComponent } from './event-view.component';
import { TaskService } from '@camera-settings/services';
import { CameraService } from '@shared/services';
import { of, Subscription } from 'rxjs';

describe('EventViewComponent', () => {
  let component: EventViewComponent;
  let fixture: ComponentFixture<EventViewComponent>;
  let mockActivatedRoute: any;
  let mockTaskService: any;
  let mockCameraService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('camera-123')
        }
      }
    };

    mockTaskService = {
      get: jasmine.createSpy('get').and.returnValue(Promise.resolve({ data: [{ id: 1 }] }))
    };

    mockCameraService = {
      get: jasmine.createSpy('get').and.returnValue(Promise.resolve({ data: { id: 'camera-123' } }))
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      declarations: [EventViewComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: TaskService, useValue: mockTaskService },
        { provide: CameraService, useValue: mockCameraService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the events page on exit', () => {
    component.ngOnDestroy();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/events', 'camera-123']);
  });
});
