import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteStockTakeComponent } from './complete-stock-take.component';

describe('CompleteStockTakeComponent', () => {
  let component: CompleteStockTakeComponent;
  let fixture: ComponentFixture<CompleteStockTakeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompleteStockTakeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteStockTakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
