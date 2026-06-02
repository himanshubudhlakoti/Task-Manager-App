import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeTaskComponent } from './components/employee-task/employee-task.component';

const routes: Routes = [
    {
        path: "", redirectTo: "my-tasks", pathMatch: "full"
    },
    {
        path: "my-tasks", component: EmployeeTaskComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmployeesPanelRoutingModule { }
