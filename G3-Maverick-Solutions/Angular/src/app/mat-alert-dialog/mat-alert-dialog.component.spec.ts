import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatAlertDialogComponent } from './mat-alert-dialog.component';

describe('MatAlertDialogComponent', () => {
  let component: MatAlertDialogComponent;
  let fixture: ComponentFixture<MatAlertDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatAlertDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatAlertDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
