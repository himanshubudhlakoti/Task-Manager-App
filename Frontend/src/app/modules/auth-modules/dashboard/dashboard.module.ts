//internal modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

//custom modules
import { DashboardRoutingModule } from './dashboard-routing.module';
//components
import { DashboardComponent } from './components/dashboard/dashboard.component';
//services
import { MessageService } from 'primeng/api';
import { DashbardService } from './services/dashbard.service';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ToastModule,
    TooltipModule
  ],
  providers: [MessageService, DashbardService]
})
export class DashboardModule { }
