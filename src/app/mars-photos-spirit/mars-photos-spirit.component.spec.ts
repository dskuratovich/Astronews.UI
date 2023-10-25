import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarsPhotosSpiritComponent } from './mars-photos-spirit.component';

describe('MarsPhotosSpiritComponent', () => {
  let component: MarsPhotosSpiritComponent;
  let fixture: ComponentFixture<MarsPhotosSpiritComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarsPhotosSpiritComponent]
    });
    fixture = TestBed.createComponent(MarsPhotosSpiritComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
