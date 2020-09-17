import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDonationComponent } from './search-donation.component';

describe('SearchDonationComponent', () => {
  let component: SearchDonationComponent;
  let fixture: ComponentFixture<SearchDonationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchDonationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchDonationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
