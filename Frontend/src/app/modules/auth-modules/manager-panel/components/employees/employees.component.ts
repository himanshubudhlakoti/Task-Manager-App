import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from 'primeng/api';
import { ManagerPanelService } from '../../services/manager-panel.service';
import { routesList } from "src/app/libs/constants";
import { IFilters } from "src/app/libs/interfaces";
import { paginationSettings } from "src/app/libs/constants";
import { TCustomObj } from "src/app/libs/types";
import { UserRoles } from 'src/app/libs/constants/enums';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit, OnDestroy {
  public assignTeamLeadSubs: any = "";
  public showErrors: boolean = false;
  public selectedTeamLead: string = "";
  public teamLeadList: { label: string; value: string }[] = [];
  public showAssignModal: boolean = false;
  public selectedEmployeeIds: string[] = [];
  public getUsersListSubs: any = "";
  public routesList: any = routesList;
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
  ) { }

  ngOnInit(): void {
    this.getUsersList();
    this.getTeamLeadList();
  }

  private getUsersList(): void {

    const filtersString: string = JSON.stringify(this.filters);
    const role: UserRoles = UserRoles.EMPLOYEE;
    this.spinner.show();

    this.getUsersListSubs = this.managerPanelService
      .getUsersList(role, filtersString)
      .subscribe(
        res => {
          this.spinner.hide();
          this.usersData = res.data;
          this.count = res.count;
        },
        err => {
          this.usersData = [];
          this.count = 0;
          this.spinner.hide();
          this.showToastr(false, err);
        }
      );
  }

  private getTeamLeadList(): void {

    const filteredObject = {
      ...this.filters,
      pageNumber: 1,
      limit: 1000
    };
    const filtersString: string = JSON.stringify(filteredObject);
    const role: UserRoles = UserRoles.TEAM_LEADER;

    this.spinner.show();
    this.getUsersListSubs = this.managerPanelService
      .getUsersList(role, filtersString)
      .subscribe(
        res => {
          this.spinner.hide();
          const result = res.data || [];
          this.setDropdownValues(result);
        },
        err => {
          this.teamLeadList = [];
          this.spinner.hide();
          this.showToastr(false, err);
        }
      );
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
    } else {
      this.filters.isSearching = false;
      this.filters.searchingData = "";
    }
    this.getUsersList();
  }

  showToastr(success: boolean, info: any, sticky: boolean = false): void {

    this.messageService.clear();

    if (success) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: info,
        sticky
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: info.message || info,
        sticky
      });
    }
  }

  onEmployeeSelection(event: any, employeeId: string): void {

    if (event.checked) {

      if (!this.selectedEmployeeIds.includes(employeeId)) {
        this.selectedEmployeeIds.push(employeeId);
      }
    } else {

      this.selectedEmployeeIds = this.selectedEmployeeIds.filter(
        id => id !== employeeId
      );
    }
  }

  assignTeamLead(): void {

    this.showErrors = false;
    if (!this.selectedTeamLead) {
      this.showErrors = true;
      return;
    }

    this.spinner.show();
    this.assignTeamLeadSubs = this.managerPanelService
      .assignLeader({ employeeIds: this.selectedEmployeeIds, teamLeadId: this.selectedTeamLead })
      .subscribe(
        res => {
          this.spinner.hide();
          this.showAssignModal = false;
          this.selectedEmployeeIds = [];
          this.selectedTeamLead = "";
          this.getUsersList();
          this.showToastr(true, 'Team Lead assigned successfully');
        },
        err => {

          this.spinner.hide();
          this.showToastr(false, err);
        }
      );
  }

  private setDropdownValues(teamLeads: any[]): void {

    this.teamLeadList = teamLeads.map(lead => ({
      label: lead.fName + " " + lead.lName,
      value: lead._id
    }));
  }

  ngOnDestroy(): void {

    if (this.getUsersListSubs) {
      this.getUsersListSubs.unsubscribe();
    }
    if (this.assignTeamLeadSubs) {
      this.assignTeamLeadSubs.unsubscribe();
    }
  }
}