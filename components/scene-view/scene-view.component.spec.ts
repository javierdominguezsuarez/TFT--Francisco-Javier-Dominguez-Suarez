import { SceneViewComponent } from './scene-view.component';

describe('SceneViewComponent', () => {
  let component: SceneViewComponent;

  beforeEach(() => {
    component = new SceneViewComponent(null, null, null, null, null);
  });

  it('should get scene data successfully', () => {
    component.getScene();
    expect(component.scene.id).toEqual(1);
  });

  it('should get event data and set properties successfully', () => {
    component.getEvent();
    expect(component.date).toEqual('2022-01-01');
    expect(component.startHour).toEqual('00:00:00');
    expect(component.endHour).toEqual('02:00:00');
  });

  it('should get images data and set properties successfully', () => {
    component.getImages(true);
    expect(component.imagesMini.length).toEqual(1);
  });

  it('should get videos data and set properties successfully', () => {
    component.getVideos(true);
    expect(component.videos.length).toEqual(1);
  });

  it('should set switch property to false when "Image" is selected', () => {
    component.switch = true;
    component.onSelectedOption('Image');
    expect(component.switch).toBe(false);
  });

  it('should set switch property to true and call getVideos method when "Video" is selected', () => {
    spyOn(component, 'getVideos');
    component.switch = false;
    component.onSelectedOption('Video');
    expect(component.switch).toBe(true);
    expect(component.getVideos).toHaveBeenCalled();
  });


});
