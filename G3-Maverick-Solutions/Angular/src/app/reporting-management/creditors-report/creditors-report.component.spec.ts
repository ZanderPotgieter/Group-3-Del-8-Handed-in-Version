import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditorsReportComponent } from './creditors-report.component';

describe('CreditorsReportComponent', () => {
  let component: CreditorsReportComponent;
  let fixture: ComponentFixture<CreditorsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditorsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditorsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
