import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchedDonationDetailsComponent } from './searched-donation-details.component';

describe('SearchedDonationDetailsComponent', () => {
  let component: SearchedDonationDetailsComponent;
  let fixture: ComponentFixture<SearchedDonationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchedDonationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchedDonationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
