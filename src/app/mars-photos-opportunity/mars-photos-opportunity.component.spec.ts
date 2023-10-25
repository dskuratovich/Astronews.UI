import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarsPhotosOpportunityComponent } from './mars-photos-opportunity.component';

describe('MarsPhotosOpportunityComponent', () => {
  let component: MarsPhotosOpportunityComponent;
  let fixture: ComponentFixture<MarsPhotosOpportunityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarsPhotosOpportunityComponent]
    });
    fixture = TestBed.createComponent(MarsPhotosOpportunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
