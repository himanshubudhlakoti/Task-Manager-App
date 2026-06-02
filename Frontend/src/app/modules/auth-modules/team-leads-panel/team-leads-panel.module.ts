import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamLeadsPanelRoutingModule } from './team-leads-panel.routing.module';
import { TeamLeadsTasksComponent } from './components/team-leads-tasks/team-leads-tasks.component';
import { TeamLeadsEmployeeComponent } from './components/team-leads-employee/team-leads-employee.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TeamLeadsPanelService } from './services/team-leads-panel.service';
import { ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
  declarations: [TeamLeadsTasksComponent, TeamLeadsEmployeeComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextareaModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    ToastModule,
    TooltipModule,
    CheckboxModule,
    TeamLeadsPanelRoutingModule,
  ],
  providers: [TeamLeadsPanelService, MessageService]
})
export class TeamLeadsPanelModule { }
