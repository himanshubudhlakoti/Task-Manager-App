// MODUELS----------------------
//internal****
import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { KeyFilterModule } from 'primeng/keyfilter';
import { PasswordModule } from 'primeng/password';
//custom****
import { UserRoutingModule } from './user-routing.module';
import { DropdownModule } from 'primeng/dropdown';
//COMPONENTS---------------------
import { LoginComponent } from './components/login/login.component';
//SERVICES----------------------
import { UserService } from './services/user.service';
import { LoginAuthGuard } from 'src/app/libs/security/auth.guards';
import { SignUpComponent } from './components/sign-up/sign-up.component';


@NgModule({
  declarations: [
    SignUpComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    ToastModule,
    KeyFilterModule,
    UserRoutingModule,
    PasswordModule,
    DropdownModule
  ],
  providers: [
    UserService,
    LoginAuthGuard,
    MessageService
  ]
})
export class UserModule { }
