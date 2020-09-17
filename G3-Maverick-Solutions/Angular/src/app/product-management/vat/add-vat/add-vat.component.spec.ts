import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVatComponent } from './add-vat.component';

describe('AddVatComponent', () => {
  let component: AddVatComponent;
  let fixture: ComponentFixture<AddVatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
