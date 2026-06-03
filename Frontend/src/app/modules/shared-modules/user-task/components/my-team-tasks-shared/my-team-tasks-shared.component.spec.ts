import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTeamTasksSharedComponent } from './my-team-tasks-shared.component';

describe('MyTeamTasksSharedComponent', () => {
  let component: MyTeamTasksSharedComponent;
  let fixture: ComponentFixture<MyTeamTasksSharedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyTeamTasksSharedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTeamTasksSharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
