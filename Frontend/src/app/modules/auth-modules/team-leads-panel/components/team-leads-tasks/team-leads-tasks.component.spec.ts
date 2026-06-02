import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamLeadsTasksComponent } from './team-leads-tasks.component';

describe('TeamLeadsTasksComponent', () => {
  let component: TeamLeadsTasksComponent;
  let fixture: ComponentFixture<TeamLeadsTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamLeadsTasksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamLeadsTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
