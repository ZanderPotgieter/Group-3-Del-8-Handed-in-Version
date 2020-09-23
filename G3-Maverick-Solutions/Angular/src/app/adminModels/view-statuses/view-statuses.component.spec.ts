import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStatusesComponent } from './view-statuses.component';

describe('ViewStatusesComponent', () => {
  let component: ViewStatusesComponent;
  let fixture: ComponentFixture<ViewStatusesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStatusesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
