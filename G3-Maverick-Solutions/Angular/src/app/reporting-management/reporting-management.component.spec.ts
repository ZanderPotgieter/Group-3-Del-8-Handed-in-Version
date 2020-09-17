import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingManagementComponent } from './reporting-management.component';

describe('ReportingManagementComponent', () => {
  let component: ReportingManagementComponent;
  let fixture: ComponentFixture<ReportingManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportingManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
