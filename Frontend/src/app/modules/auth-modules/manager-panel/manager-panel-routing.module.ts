import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeesComponent } from "./components/employees/employees.component";
import { TeamLeadsComponent } from "./components/team-leads/team-leads.component";
import { TasksComponent } from './components/tasks/tasks.component';
import { MyTasksComponent } from './components/my-tasks/my-tasks.component';

const routes: Routes = [
  {
    path: "", redirectTo: "team-leads", pathMatch: "full"
  },
  {
    path: "team-leads", component: TeamLeadsComponent
  },
  {
    path: "employees", component: EmployeesComponent
  },
  {
    path: "leads-task", component: TasksComponent
  },
  {
    path: "my-tasks", component: MyTasksComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ManagerPanelRoutingModule { }
