import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateareaComponent } from './updatearea.component';

describe('UpdateareaComponent', () => {
  let component: UpdateareaComponent;
  let fixture: ComponentFixture<UpdateareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
