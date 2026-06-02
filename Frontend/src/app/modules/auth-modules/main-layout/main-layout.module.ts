//Internal modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner";
//Custom modules
import { MainLayoutRoutingModule } from './main-layout-routing.module';
import { SubHeaderModule } from "src/app/modules/shared-modules/sub-header/sub-header.module"
//Components
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { MainSidebarComponent } from './components/main-sidebar/main-sidebar.component';
import { MainHeaderComponent } from './components/main-header/main-header.component';
import { MainFooterComponent } from './components/main-footer/main-footer.component';
//Services
import { MainLayoutService } from "./services/main-layout.service";
import { EntryAuthGuard } from "src/app/libs/security/auth.guards";
import { RBACAuthGuard } from 'src/app/libs/security/auth.guards';

@NgModule({
  declarations: [
    MainLayoutComponent,
    MainSidebarComponent,
    MainHeaderComponent,
    MainFooterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MainLayoutRoutingModule,
    NgxSpinnerModule,
    SubHeaderModule
  ],
  providers: [
    MainLayoutService,
    EntryAuthGuard,
    RBACAuthGuard
  ]
})
export class MainLayoutModule { }
