import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationRecipientComponent } from './donation-recipient.component';

describe('DonationRecipientComponent', () => {
  let component: DonationRecipientComponent;
  let fixture: ComponentFixture<DonationRecipientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonationRecipientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationRecipientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
