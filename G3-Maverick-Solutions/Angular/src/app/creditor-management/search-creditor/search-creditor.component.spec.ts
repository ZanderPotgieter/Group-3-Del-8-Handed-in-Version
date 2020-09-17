import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCreditorComponent } from './search-creditor.component';

describe('SearchCreditorComponent', () => {
  let component: SearchCreditorComponent;
  let fixture: ComponentFixture<SearchCreditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchCreditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCreditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
