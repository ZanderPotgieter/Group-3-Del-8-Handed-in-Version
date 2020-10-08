import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchStockTakeComponent } from './search-stock-take.component';

describe('SearchStockTakeComponent', () => {
  let component: SearchStockTakeComponent;
  let fixture: ComponentFixture<SearchStockTakeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchStockTakeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchStockTakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
