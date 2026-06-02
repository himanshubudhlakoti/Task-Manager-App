
//internal
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from 'primeng/api';
// custom
import { ManagerPanelService } from '../../services/manager-panel.service';
import { IFilters } from "src/app/libs/interfaces";
import { paginationSettings } from "src/app/libs/constants";
import { TCustomObj } from "src/app/libs/types";
import { UserRoles } from 'src/app/libs/constants/enums';
@Component({
  selector: 'app-team-leads',
  templateUrl: './team-leads.component.html',
  styleUrls: ['./team-leads.component.scss']
})
export class TeamLeadsComponent implements OnInit {
  public count: number = 0;
  public usersData: any[] = [];
  public filters: IFilters = {
    pageNumber: 1,
    limit: paginationSettings.LIMIT,
    condition: {},
    isSearching: false,
    searchingField: "",
    searchingData: "",
    fetchVia: '_id',
    fetchOrder: -1
  };
  public paginationSettings = paginationSettings;
  constructor(
    private managerPanelService: ManagerPanelService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {

    this.getUsersList();
  }

  getUsersList(): void {

    const filtersString: string = JSON.stringify(this.filters);
    this.spinner.show();

    const role: UserRoles = UserRoles.TEAM_LEADER;
   this.managerPanelService.getUsersList(role, filtersString).subscribe(res => {

      this.spinner.hide();
      this.usersData = res.data;
      this.count = res.count;
    }, err => {

      this.usersData = [];
      this.count = 0;
      this.spinner.hide();
      this.showToastr(false, err);
    });
  }

  setPage(event: any): void {

    this.filters.pageNumber = event.page + 1;
    this.filters.limit = event.rows;
    this.getUsersList();
  }

  setSearchFilter(event: TCustomObj): void {

    if (event.target.value) {

      this.filters.isSearching = true;
      this.filters.searchingData = event.target.value;
      this.getUsersList();
    } else {

      this.filters.isSearching = false;
      this.filters.searchingData = "";
      this.getUsersList();
    }
  }

  showToastr(success: boolean, info: any, sticky: boolean = false): void {

    this.messageService.clear()
    if (success) {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: info, sticky });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: info.message || info, sticky });
    }
  }

  ngOnDestroy() {
  }
}
