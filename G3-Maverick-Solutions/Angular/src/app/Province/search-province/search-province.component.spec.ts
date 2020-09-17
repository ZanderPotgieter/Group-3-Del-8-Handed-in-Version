import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchProvinceComponent } from './search-province.component';

describe('SearchProvinceComponent', () => {
  let component: SearchProvinceComponent;
  let fixture: ComponentFixture<SearchProvinceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchProvinceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchProvinceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
