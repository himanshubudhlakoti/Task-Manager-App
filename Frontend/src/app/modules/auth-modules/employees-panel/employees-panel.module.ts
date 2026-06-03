import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeesPanelRoutingModule } from './employees-panel.routing.module';
import { EmployeeTaskComponent } from './components/employee-task/employee-task.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { EmployeesPanelService } from './services/employees-panel.service';
import { ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { UserTaskModule } from "src/app/modules/shared-modules/user-task/user-task.module";

@NgModule({
  declarations: [
    EmployeeTaskComponent
  ],
  imports: [
    CommonModule,
    EmployeesPanelRoutingModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    ToastModule,
    ButtonModule,
    TooltipModule,
    ReactiveFormsModule,
    UserTaskModule
  ],
  providers: [EmployeesPanelService, MessageService]
})
export class EmployeesPanelModule { }
