import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { routesList } from "src/app/libs/constants";

@Component({
  selector: 'app-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss']
})
export class SubHeaderComponent {
  public currentUrl: any = "";
  public routesList: any = routesList;
  public breadcrumbList: Array<any> = [];
  public showDropdown: boolean = false;

  constructor(
    private router: Router,
    private location: Location
  ) {


    if (!this.currentUrl) { this.currentUrl = this.router.url; }
    this.setBredcrumb(this.currentUrl);
    //first time while loading this location does not gives the url- so first time above line gives 
    //activated url and after that each time loaction gives url & above line does not execute
    this.location.onUrlChange((url) => {

      this.currentUrl = url;
      this.setBredcrumb(this.currentUrl);
    });

  }

  setBredcrumb(currentUrl: string): void {
    this.breadcrumbList = [];

    for (let i in this.routesList) {

      if (this.routesList[i].path === currentUrl) {

        this.breadcrumbList.push({ label: this.routesList[i].name, url: this.routesList[i].path });
        break;
      }
    }
  }
}
