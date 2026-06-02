import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';
import { KeyFilterModule } from 'primeng/keyfilter';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { MessageService } from 'primeng/api';

import { ManagerPanelRoutingModule } from './manager-panel-routing.module';
import { EmployeesComponent } from "./components/employees/employees.component";
import { TeamLeadsComponent } from "./components/team-leads/team-leads.component";
import { TasksComponent } from './components/tasks/tasks.component';
import { MyTasksComponent } from './components/my-tasks/my-tasks.component';

@NgModule({
  declarations: [
    EmployeesComponent,
    TeamLeadsComponent,
    TasksComponent,
    MyTasksComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    TableModule,
    PaginatorModule,
    InputSwitchModule,
    ButtonModule,
    DialogModule,
    PasswordModule,
    InputTextareaModule,
    TooltipModule,
    ToastModule,
    CheckboxModule,
    KeyFilterModule,
    NgxSpinnerModule,
    ManagerPanelRoutingModule
  ],
  providers: [
    NgxSpinnerService,
    MessageService
  ]
})
export class ManagerPanelModule { }
