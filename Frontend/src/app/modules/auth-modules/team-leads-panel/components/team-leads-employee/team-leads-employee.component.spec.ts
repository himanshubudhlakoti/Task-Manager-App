import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamLeadsEmployeeComponent } from './team-leads-employee.component';

describe('TeamLeadsEmployeeComponent', () => {
  let component: TeamLeadsEmployeeComponent;
  let fixture: ComponentFixture<TeamLeadsEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamLeadsEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamLeadsEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
