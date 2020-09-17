import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSaleComponent } from './search-sale.component';

describe('SearchSaleComponent', () => {
  let component: SearchSaleComponent;
  let fixture: ComponentFixture<SearchSaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchSaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
