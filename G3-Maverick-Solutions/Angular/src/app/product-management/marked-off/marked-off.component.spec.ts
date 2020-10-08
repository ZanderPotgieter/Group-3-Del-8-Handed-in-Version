import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkedOffComponent } from './marked-off.component';

describe('MarkedOffComponent', () => {
  let component: MarkedOffComponent;
  let fixture: ComponentFixture<MarkedOffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkedOffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkedOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
