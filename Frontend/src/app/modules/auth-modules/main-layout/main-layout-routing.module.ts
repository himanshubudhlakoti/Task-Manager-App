import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { EntryAuthGuard } from "src/app/libs/security/auth.guards";
import { RBACAuthGuard } from 'src/app/libs/security/auth.guards';
import { UserRoles } from 'src/app/libs/constants/enums';
const routes: Routes =
  [
    {
      path: "", component: MainLayoutComponent,
      children: [
        {
          path: "dashboard", canActivate: [EntryAuthGuard], loadChildren: () => import("../dashboard/dashboard.module").then(m => m.DashboardModule)
        },
        {
          path: "manager-panel",
          canActivate: [RBACAuthGuard],
          data: {
            roles: [UserRoles.MANAGER]
          },
          loadChildren: () => import("../manager-panel/manager-panel.module").then(m => m.ManagerPanelModule)
        },
        {
          path: "employee-panel",
          canActivate: [RBACAuthGuard],
          data: {
            roles: [UserRoles.EMPLOYEE]
          }, loadChildren: () => import("../employees-panel/employees-panel.module").then(m => m.EmployeesPanelModule)
        },
        {
          path: "team-lead-panel",
          canActivate: [RBACAuthGuard], data: { roles: [UserRoles.TEAM_LEADER] },
          loadChildren: () => import("../team-leads-panel/team-leads-panel.module").then(m => m.TeamLeadsPanelModule)
        }
      ]
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainLayoutRoutingModule { }
