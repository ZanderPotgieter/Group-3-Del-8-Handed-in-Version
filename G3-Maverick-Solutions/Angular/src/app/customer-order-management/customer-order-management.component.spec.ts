import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerOrderManagementComponent } from './customer-order-management.component';

describe('CustomerOrderManagementComponent', () => {
  let component: CustomerOrderManagementComponent;
  let fixture: ComponentFixture<CustomerOrderManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerOrderManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerOrderManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
