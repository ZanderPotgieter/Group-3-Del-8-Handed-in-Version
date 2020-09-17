import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchProductCategoryComponent } from './search-product-category.component';

describe('SearchProductCategoryComponent', () => {
  let component: SearchProductCategoryComponent;
  let fixture: ComponentFixture<SearchProductCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchProductCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchProductCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
