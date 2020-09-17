import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSupplierOrderComponent } from './search-supplier-order.component';

describe('SearchSupplierOrderComponent', () => {
  let component: SearchSupplierOrderComponent;
  let fixture: ComponentFixture<SearchSupplierOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchSupplierOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSupplierOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
