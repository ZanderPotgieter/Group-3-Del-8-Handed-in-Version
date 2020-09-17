import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDonationRecipientComponent } from './search-donation-recipient.component';

describe('SearchDonationRecipientComponent', () => {
  let component: SearchDonationRecipientComponent;
  let fixture: ComponentFixture<SearchDonationRecipientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchDonationRecipientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchDonationRecipientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
