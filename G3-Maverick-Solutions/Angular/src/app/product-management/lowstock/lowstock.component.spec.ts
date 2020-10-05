import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LowstockComponent } from './lowstock.component';

describe('LowstockComponent', () => {
  let component: LowstockComponent;
  let fixture: ComponentFixture<LowstockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LowstockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LowstockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
