import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GPSManagementComponent } from './gps-management.component';

describe('GPSManagementComponent', () => {
  let component: GPSManagementComponent;
  let fixture: ComponentFixture<GPSManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GPSManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GPSManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
