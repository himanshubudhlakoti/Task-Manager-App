import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainLayoutService } from '../../services/main-layout.service';
import { routesList } from "src/app/libs/constants";
import { UserRoles } from "src/app/libs/constants/enums";
import { DataSharingService } from 'src/app/modules/shared-modules/data-sharing/services/data-sharing.service';

@Component({
  selector: 'app-main-sidebar',
  templateUrl: './main-sidebar.component.html',
  styleUrls: ['./main-sidebar.component.scss']
})

export class MainSidebarComponent implements OnInit {

  public getCurrentUserRoleFromShareSubs: any = "";
  public currentUserRole: UserRoles | null = null;
  public userRoles: typeof UserRoles = UserRoles;;
  public getToggleSubs: any = "";
  public routesList: any = routesList;
  toggle: boolean = true;
  collapseDashboard: boolean = false;
  collapseMain: boolean = false
  constructor(private mainLayoutService: MainLayoutService,
    private router: Router,
    private dataSharingService: DataSharingService) {
    this.getToggleSubs = this.mainLayoutService.getToggle().subscribe((res) => {
      this.toggle = res
    }, (err) => {

    })

    this.getCurrentUserRoleFromShareSubs =
      this.dataSharingService.getCurrentUserRoleFromShare().subscribe(
        (res) => {
          this.currentUserRole = res;
        },
        (err) => {
          this.currentUserRole = null;
        }
      );
  }

  ngOnInit(): void { }

  toggleDiv(e: any) {
    switch (e) {
      case 'dashboard':
        this.collapseDashboard = !this.collapseDashboard
        break;
      case 'main':
        this.collapseMain = !this.collapseMain
        break;
    }
  }

  close() {
    if (window.innerWidth <= 991) {
      this.toggle = !this.toggle;
      this.mainLayoutService.toggleChange(this.toggle);
    }
  }

  logout(): void {
    localStorage.clear();
    this.dataSharingService.setCurrentUserRoleToShare(null);
    this.router.navigate([this.routesList.LOGIN.path]);
  }

  ngOnDestroy() {

    this.getToggleSubs.unsubscribe();
    this.getCurrentUserRoleFromShareSubs.unsubscribe();
  }
}
