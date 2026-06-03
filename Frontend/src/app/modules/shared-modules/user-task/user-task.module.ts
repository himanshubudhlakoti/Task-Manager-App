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
import { UserTasksService } from "./services/user-tasks.service";
import { MyTasksSharedComponent } from './components/my-tasks-shared/my-tasks-shared.component';
import { MyTeamTasksSharedComponent } from './components/my-team-tasks-shared/my-team-tasks-shared.component';
import { DeleteTaskComponent } from './components/delete-task/delete-task.component';

@NgModule({
  declarations: [
    MyTasksSharedComponent,
    MyTeamTasksSharedComponent,
    DeleteTaskComponent
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
    NgxSpinnerModule
  ],
  providers: [UserTasksService],
  exports: [
    MyTasksSharedComponent,
    MyTeamTasksSharedComponent,
    DeleteTaskComponent
  ]
})
export class UserTaskModule { }
