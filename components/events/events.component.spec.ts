import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsComponent } from './events.component';
import { TaskService } from '@camera-settings/services';
import { CameraService } from '@shared/services';
import { of, Subscription } from 'rxjs';
import { Event } from '@events/models/events';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { FilterComponent } from '../filter/filter.component';
import { ButtonComponent } from '../button/button.component';

describe('EventsComponent', () => {
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;
  let mockActivatedRoute: any;
  let mockTaskService: any;
  let mockCameraService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockActivatedRoute = {
      params: of({ cameraReference: 'mockCameraReference' }),
      snapshot: { paramMap: { get: () => 'mockCameraReference' } }
    };

    mockTaskService = {
      getCached: jasmine.createSpy('getCached').and.returnValue(of([])),
      getScenesCached: jasmine.createSpy('getScenesCached').and.returnValue(of([]))
    };

    mockCameraService = {
      get: jasmine.createSpy('get').and.returnValue(Promise.resolve({ data: [{ id: 1 }] }))
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      declarations: [EventsComponent, SearchBarComponent, FilterComponent, ButtonComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: TaskService, useValue: mockTaskService },
        { provide: CameraService, useValue: mockCameraService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to "/new" when adding an event', () => {
    component.addEvent();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/new']);
  });

  it('should unsubscribe from subscriptions on component destruction', () => {
    component.routeSubscription = new Subscription();
    component.taskSubscription = new Subscription();
    component.sceneSubscription = new Subscription();

    spyOn(component.routeSubscription, 'unsubscribe');
    spyOn(component.taskSubscription, 'unsubscribe');
    spyOn(component.sceneSubscription, 'unsubscribe');

    component.ngOnDestroy();

    expect(component.routeSubscription.unsubscribe).toHaveBeenCalled();
    expect(component.taskSubscription.unsubscribe).toHaveBeenCalled();
    expect(component.sceneSubscription.unsubscribe).toHaveBeenCalled();
  });
});
