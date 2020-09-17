import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditorManagementComponent } from './creditor-management.component';

describe('CreditorManagementComponent', () => {
  let component: CreditorManagementComponent;
  let fixture: ComponentFixture<CreditorManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditorManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditorManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
