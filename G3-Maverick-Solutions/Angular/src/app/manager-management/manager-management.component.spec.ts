import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerManagementComponent } from './manager-management.component';

describe('ManagerManagementComponent', () => {
  let component: ManagerManagementComponent;
  let fixture: ComponentFixture<ManagerManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
