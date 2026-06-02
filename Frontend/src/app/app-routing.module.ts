import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: "", redirectTo: "users", pathMatch: "full" },//default
  { path: "users", loadChildren: () => import("./modules/non-auth-modules/user.module").then(m => m.UserModule) },
  { path: "auth-root", loadChildren: () => import("./modules/auth-modules/main-layout/main-layout.module").then(m => m.MainLayoutModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
