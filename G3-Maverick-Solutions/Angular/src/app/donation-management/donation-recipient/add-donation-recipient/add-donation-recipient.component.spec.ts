import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDonationRecipientComponent } from './add-donation-recipient.component';

describe('AddDonationRecipientComponent', () => {
  let component: AddDonationRecipientComponent;
  let fixture: ComponentFixture<AddDonationRecipientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDonationRecipientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDonationRecipientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
