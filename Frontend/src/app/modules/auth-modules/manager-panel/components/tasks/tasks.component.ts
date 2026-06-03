import { Component } from '@angular/core';
import { UserRoles } from "src/app/libs/constants/enums";


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent {

  public userRoles: typeof UserRoles = UserRoles;
}