import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCreditorComponent } from './add-creditor.component';

describe('AddCreditorComponent', () => {
  let component: AddCreditorComponent;
  let fixture: ComponentFixture<AddCreditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCreditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCreditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
