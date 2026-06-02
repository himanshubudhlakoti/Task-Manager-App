import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, animate, style } from '@angular/animations';
import { MainLayoutService } from '../../services/main-layout.service';
import { routesList } from "src/app/libs/constants";
import { httpCodes } from "src/app/libs/constants/http.codes";
import { DataSharingService } from 'src/app/modules/shared-modules/data-sharing/services/data-sharing.service';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-20px)' }),
        animate('500ms ease-in', style({ transform: 'translateY(0%)' }))
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ transform: 'translateY(-100%)' }))
      ])
    ])
  ]
})
export class MainHeaderComponent implements OnInit {

  public getUserProfileSubs: any = "";
  public getToggleSubs: any = "";
  public routesList: any = routesList;
  public ProfileData: any = {};
  notificationPopup: boolean = false;
  profilePopup: boolean = false;
  toggle: boolean = true;

  constructor(
    private mainLayoutService: MainLayoutService,
    private dataSharingService: DataSharingService,
    private router: Router) {

    this.getToggleSubs = this.mainLayoutService.getToggle().subscribe((res) => {
      this.toggle = res;
    }, (err) => { })
  }

  ngOnInit() {

    this.getUserProfile();
  }

  getUserProfile(): void {
    this.getUserProfileSubs = this.mainLayoutService.getUserProfile().subscribe(res => {
      this.ProfileData = res.data;
      this.dataSharingService.setCurrentUserRoleToShare(this.ProfileData.role);
    }, err => {
      if (err && err.statusCode === httpCodes.UNAUTHORIZED) {
        alert("token expired JWT");
        localStorage.clear();
        // redirect to login
        this.router.navigate([this.routesList.LOGIN.path]);
      } else {
        localStorage.clear();
        // redirect to login
        this.router.navigate([this.routesList.LOGIN.path]);
      }
    });
  }

  logout(): void {

    localStorage.clear();
    this.router.navigate([routesList.LOGIN.path]);
  }

  openNotification() {
    this.profilePopup = false;
    this.notificationPopup = !this.notificationPopup
  }

  openProfile() {
    this.notificationPopup = false;
    this.profilePopup = !this.profilePopup
  }

  openSidebar() {
    this.toggle = !this.toggle;
    this.mainLayoutService.toggleChange(this.toggle);
  }

  ngOnDestroy() {
    this.getUserProfileSubs.unsubscribe();
    this.getToggleSubs.unsubscribe();
  }
}

