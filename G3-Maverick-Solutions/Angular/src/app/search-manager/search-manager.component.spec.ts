import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchManagerComponent } from './search-manager.component';

describe('SearchManagerComponent', () => {
  let component: SearchManagerComponent;
  let fixture: ComponentFixture<SearchManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
