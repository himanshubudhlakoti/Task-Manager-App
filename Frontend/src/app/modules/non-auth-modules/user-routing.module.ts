import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LoginAuthGuard } from 'src/app/libs/security/auth.guards';
import { routesList } from 'src/app/libs/constants';

const routes: Routes = [
  {
    path: "", redirectTo: 'user-login', pathMatch: "full"
  },
  {
    path: 'user-login', canActivate: [LoginAuthGuard], component: LoginComponent
  },
  {
    path: 'sign-up', canActivate: [LoginAuthGuard], component: SignUpComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
