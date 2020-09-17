import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCreditorComponent } from './update-creditor.component';

describe('UpdateCreditorComponent', () => {
  let component: UpdateCreditorComponent;
  let fixture: ComponentFixture<UpdateCreditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateCreditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCreditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
