import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchedProductDetailsComponent } from './searched-product-details.component';

describe('SearchedProductDetailsComponent', () => {
  let component: SearchedProductDetailsComponent;
  let fixture: ComponentFixture<SearchedProductDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchedProductDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchedProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
