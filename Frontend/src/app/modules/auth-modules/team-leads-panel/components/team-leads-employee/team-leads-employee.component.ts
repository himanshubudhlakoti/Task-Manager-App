import { Component } from '@angular/core';
import { UserRoles } from "src/app/libs/constants/enums";

@Component({
  selector: 'app-team-leads-employee',
  templateUrl: './team-leads-employee.component.html',
  styleUrls: ['./team-leads-employee.component.scss']
})
export class TeamLeadsEmployeeComponent {
  public userRoles: typeof UserRoles = UserRoles;
}