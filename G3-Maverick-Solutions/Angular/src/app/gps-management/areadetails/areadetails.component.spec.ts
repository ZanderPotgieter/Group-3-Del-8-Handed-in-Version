import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreadetailsComponent } from './areadetails.component';

describe('AreadetailsComponent', () => {
  let component: AreadetailsComponent;
  let fixture: ComponentFixture<AreadetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreadetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreadetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
