import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkedoffProductReportComponent } from './markedoff-product-report.component';

describe('MarkedoffProductReportComponent', () => {
  let component: MarkedoffProductReportComponent;
  let fixture: ComponentFixture<MarkedoffProductReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkedoffProductReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkedoffProductReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
