import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateOTPComponent } from './generate-otp.component';

describe('GenerateOTPComponent', () => {
  let component: GenerateOTPComponent;
  let fixture: ComponentFixture<GenerateOTPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateOTPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateOTPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
