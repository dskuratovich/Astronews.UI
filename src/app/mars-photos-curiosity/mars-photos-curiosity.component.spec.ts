import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarsPhotosCuriosityComponent } from './mars-photos-curiosity.component';

describe('MarsPhotosComponent', () => {
  let component: MarsPhotosCuriosityComponent;
  let fixture: ComponentFixture<MarsPhotosCuriosityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarsPhotosCuriosityComponent]
    });
    fixture = TestBed.createComponent(MarsPhotosCuriosityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
