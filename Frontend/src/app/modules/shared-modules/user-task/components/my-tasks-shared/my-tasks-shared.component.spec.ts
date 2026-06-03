import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTasksSharedComponent } from './my-tasks-shared.component';

describe('MyTasksSharedComponent', () => {
  let component: MyTasksSharedComponent;
  let fixture: ComponentFixture<MyTasksSharedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyTasksSharedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTasksSharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
