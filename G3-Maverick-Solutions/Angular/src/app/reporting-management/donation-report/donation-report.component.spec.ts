import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationReportComponent } from './donation-report.component';

describe('DonationReportComponent', () => {
  let component: DonationReportComponent;
  let fixture: ComponentFixture<DonationReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonationReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
