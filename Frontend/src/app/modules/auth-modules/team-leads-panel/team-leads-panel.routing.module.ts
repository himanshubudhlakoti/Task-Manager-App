import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeamLeadsTasksComponent } from './components/team-leads-tasks/team-leads-tasks.component';
import { TeamLeadsEmployeeComponent } from './components/team-leads-employee/team-leads-employee.component';

const routes: Routes = [
    {
        path: "", redirectTo: "my-tasks", pathMatch: "full"
    },
    {
        path: "my-tasks", component: TeamLeadsTasksComponent
    },
    {
        path: "employees-tasks", component: TeamLeadsEmployeeComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TeamLeadsPanelRoutingModule { }