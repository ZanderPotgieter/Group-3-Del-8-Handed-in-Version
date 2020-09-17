import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateareaComponent } from './createarea.component';

describe('CreateareaComponent', () => {
  let component: CreateareaComponent;
  let fixture: ComponentFixture<CreateareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
