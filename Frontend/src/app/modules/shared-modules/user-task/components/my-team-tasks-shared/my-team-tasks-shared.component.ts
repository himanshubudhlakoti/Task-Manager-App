import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskStatuses } from 'src/app/libs/constants/enums';
import { MessageService } from 'primeng/api';
import { TeamLeadsPanelService } from '../../../../auth-modules/team-leads-panel/services/team-leads-panel.service';
import { EmployeesPanelService } from '../../../../auth-modules/employees-panel/services/employees-panel.service';
import { ManagerPanelService } from '../../../../auth-modules/manager-panel/services/manager-panel.service';

import { IFilters } from "src/app/libs/interfaces";
import { paginationSettings } from "src/app/libs/constants";
import { UserRoles } from "src/app/libs/constants/enums";
import { NgxSpinnerService } from "ngx-spinner";
enum actionTypes {
  CREATE = 'create',
  EDIT = 'edit'
}

@Component({
  selector: 'app-my-team-tasks-shared',
  templateUrl: './my-team-tasks-shared.component.html',
  styleUrls: ['./my-team-tasks-shared.component.scss']
})
export class MyTeamTasksSharedComponent implements OnInit {

  @Input() role: UserRoles | null = null;
  public userRoles: typeof UserRoles = UserRoles;
  public teamLeads: any[] = [];
  public teamLeadEmployees: any[] = [];
  public selectedEmployeeId: any = null;
  public taskId: string = "";
  public actionType: actionTypes = actionTypes.CREATE;
  public actionTypes: typeof actionTypes = actionTypes;
  public pendingTasks: any[] = [];
  public inProgressTasks: any[] = [];
  public completedTasks: any[] = [];
  public employeeTasksData: any[] = [];
  public count: number = 0
  public filters: IFilters = {
    pageNumber: 1,
    limit: 500,
    condition: {},
    isSearching: false,
    searchingField: "",
    searchingData: "",
    fetchVia: '_id',
    fetchOrder: -1
  };
  public paginationSettings = paginationSettings;

  showTaskModal = false;
  loader = false;

  public taskForm!: FormGroup;
  statusList = [
    {
      label: TaskStatuses.IN_PROGRESS,
      value: TaskStatuses.IN_PROGRESS
    },
    {
      label: TaskStatuses.PENDING,
      value: TaskStatuses.PENDING
    },
    {
      label: TaskStatuses.COMPLETED,
      value: TaskStatuses.COMPLETED,
    },
  ];
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private teamLeadsPanelService: TeamLeadsPanelService,
    private employeesPanelService: EmployeesPanelService,
    private managerPanelService: ManagerPanelService
  ) { }

  ngOnInit(): void {

    this.taskForm = this.getTaskFrom();
  }

  ngOnChanges(): void {

    //call it conditionally with manager and team lead

    if (this.role === UserRoles.TEAM_LEADER) {
      this.getTeamLeadEmployees();
    }
    if (this.role === UserRoles.MANAGER) {
      this.getTeamLeads();
    }
  }

  closeTaskModal() {

    this.showTaskModal = false;
  }

  assignATaskToEmployeeByTeamLead(): void | boolean {

    if (this.taskForm.invalid) {

      this.taskForm.markAllAsTouched();
      return;
    }

    if (this.taskForm.value.assignToSelf) {

      this.createTaskForSelf();
      return
    }

    let payload = Object.assign({}, this.taskForm.value);

    delete payload.assignToSelf;

    console.log("Payload for creating task by team lead:", payload);

    this.loader = true;
    this.teamLeadsPanelService.assignATaskToEmployeeByTeamLead(payload).subscribe(res => {

      this.loader = false;
      this.showTaskModal = false;
      this.showToastr(true, "Task assigned successfully!");

      if (this.role === UserRoles.TEAM_LEADER) {
        this.getEmployeeTasksById();
      }
      if (this.role === UserRoles.MANAGER) {
        this.getTeamLeadTasksById();
      }
      this.onAssignToSelfChange(false);
    }, err => {

      this.loader = false;
      this.showToastr(false, err, true);
    });
  }

  getEmployeeTasksById(): void {
    if (!this.selectedEmployeeId) {
      return;
    }

    const filtersString: string = JSON.stringify(this.filters);
    this.spinner.show();
    this.teamLeadsPanelService.getEmployeeTasksById(this.selectedEmployeeId, filtersString).subscribe(res => {

      this.spinner.hide();
      const result: {
        pending: any[],
        inProgress: any[],
        completed: any[]
      } = res.data;
      this.pendingTasks = result.pending;
      this.inProgressTasks = result.inProgress;
      this.completedTasks = result.completed;
    }, err => {

      this.spinner.hide();
      this.employeeTasksData = [];
      this.showToastr(false, err);
    });
  }

  getTeamLeadEmployees(): void {

    this.spinner.show();
    this.teamLeadsPanelService.getTeamLeadEmployees().subscribe(res => {

      this.spinner.hide();
      this.setLeadEmployeesDropdown(res.data);
    }, err => {

      this.spinner.hide();
      this.teamLeadEmployees = [];
      this.showToastr(false, err);
    });
  }

  private setLeadEmployeesDropdown(employees: any[]): void {

    this.teamLeadEmployees = employees.map(emp => {
      return {
        _id: emp._id,
        name: `${emp.fName} ${emp.lName}`
      }
    });
  }

  private setTeamLeadsDropdown(employees: any[]): void {

    this.teamLeads = employees.map(emp => {
      return {
        _id: emp._id,
        name: `${emp.fName} ${emp.lName}`
      }
    });
  }

  private getTaskFrom(): FormGroup {

    return this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ]
      ],

      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500)
        ]
      ],

      status: [
        TaskStatuses.PENDING,
        Validators.required
      ],

      assignedToId: [
        null,
        Validators.required
      ],
      assignToSelf: [false]
    });
  }

  setEditTaskModal(task: any): void {

    this.taskId = task._id;
    this.actionType = actionTypes.EDIT;
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      status: task.status,
      assignedToId: task.assignedToId
    });
    this.showTaskModal = true;

    console.log("Edit Task Modal Opened for Task:", task);
  }

  editTask(): void {


    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }
    let payload = Object.assign({}, this.taskForm.value);
    delete payload.assignedToId;
    delete payload.assignToSelf;
    this.loader = true;
    this.employeesPanelService.updateTask(this.taskId, payload).subscribe(res => {

      this.loader = false;
      this.showTaskModal = false;
      this.showToastr(true, "Task updated successfully!");

      if (this.role === UserRoles.TEAM_LEADER) {
        this.getEmployeeTasksById();
      }
      if (this.role === UserRoles.MANAGER) {
        this.getTeamLeadTasksById();
      }
    }, err => {

      this.loader = false;
      this.showToastr(false, err, true);
    });
  }

  openCreateTaskModal(): void {

    this.actionType = actionTypes.CREATE;
    this.taskForm.reset({
      status: TaskStatuses.PENDING
    });
    this.showTaskModal = true;
  }

  onEmployeeChange(event: any): void {

    this.selectedEmployeeId = event.value;

    if (this.role === UserRoles.TEAM_LEADER) {
      this.getEmployeeTasksById();
    }
    if (this.role === UserRoles.MANAGER) {
      this.getTeamLeadTasksById();
    }
  }

  createTaskForSelf(): void | boolean {

    let payload = Object.assign({}, this.taskForm.value);

    delete payload.assignedToId;
    delete payload.assignToSelf;
    this.loader = true;
    this.teamLeadsPanelService.createTaskForSelf(payload).subscribe(res => {

      this.loader = false;
      this.showTaskModal = false;
      this.showToastr(true, "Task created successfully!");

      if (this.role === UserRoles.TEAM_LEADER) {
        this.getTeamLeadEmployees();
      }
      if (this.role === UserRoles.MANAGER) {
        this.getTeamLeads()
      }
      this.onAssignToSelfChange(false);
    }, err => {

      this.loader = false;
      this.showToastr(false, err, true);
    });
  }

  onAssignToSelfChange(assignToSelf: boolean): void {

    const assignedToIdCtrl = this.taskForm.get('assignedToId');

    if (assignToSelf) {
      assignedToIdCtrl?.clearValidators();
      assignedToIdCtrl?.setValue(null);
    } else {
      assignedToIdCtrl?.setValidators([Validators.required]);
    }

    assignedToIdCtrl?.updateValueAndValidity();
  }

  getTeamLeadTasksById(): void {

    if (!this.selectedEmployeeId) {
      return;
    }

    this.spinner.show();
    this.managerPanelService.getTeamLeadTasksById(this.selectedEmployeeId).subscribe(res => {

      this.spinner.hide();
      const result: {
        pending: any[],
        inProgress: any[],
        completed: any[]
      } = res.data;
      this.pendingTasks = result.pending;
      this.inProgressTasks = result.inProgress;
      this.completedTasks = result.completed;
    }, err => {

      this.spinner.hide();
      this.employeeTasksData = [];
      this.showToastr(false, err);
    });
  }

  getTeamLeads(): void {

    this.spinner.show();
    this.managerPanelService.getTeamLeads().subscribe(res => {

      this.spinner.hide();
      this.setTeamLeadsDropdown(res.data);
    }, err => {

      this.spinner.hide();
      this.teamLeads = [];
      this.showToastr(false, err);
    });
  }

  taskDeletedTriggered(): void {

    if (this.role === UserRoles.TEAM_LEADER) {
      this.getEmployeeTasksById();
    }
    if (this.role === UserRoles.MANAGER) {
      this.getTeamLeadTasksById();
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
}