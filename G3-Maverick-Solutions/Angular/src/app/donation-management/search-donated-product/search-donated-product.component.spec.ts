import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDonatedProductComponent } from './search-donated-product.component';

describe('SearchDonatedProductComponent', () => {
  let component: SearchDonatedProductComponent;
  let fixture: ComponentFixture<SearchDonatedProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchDonatedProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchDonatedProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
