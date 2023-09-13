import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarsPhotosComponent } from './mars-photos.component';

describe('MarsPhotosComponent', () => {
  let component: MarsPhotosComponent;
  let fixture: ComponentFixture<MarsPhotosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarsPhotosComponent]
    });
    fixture = TestBed.createComponent(MarsPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
