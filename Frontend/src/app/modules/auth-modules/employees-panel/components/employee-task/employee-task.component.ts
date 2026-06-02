import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskStatuses } from 'src/app/libs/constants/enums';
import { MessageService } from 'primeng/api';
import { EmployeesPanelService } from '../../services/employees-panel.service';
import { IFilters } from "src/app/libs/interfaces";
import { paginationSettings } from "src/app/libs/constants";
import { NgxSpinnerService } from "ngx-spinner";
enum actionTypes {
  CREATE = 'create',
  EDIT = 'edit'
}

@Component({
  selector: 'app-employee-task',
  templateUrl: './employee-task.component.html',
  styleUrls: ['./employee-task.component.scss']
})
export class EmployeeTaskComponent implements OnInit {

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
    private employeesPanelService: EmployeesPanelService
  ) { }

  ngOnInit(): void {

    this.taskForm = this.getTaskFrom();
    this.getEmployeeTasks();
  }

  closeTaskModal() {

    this.showTaskModal = false;
  }

  createTaskByEmployee(): void | boolean {

    if (this.taskForm.invalid) {

      this.taskForm.markAllAsTouched();
      return;
    }

    let payload = Object.assign({}, this.taskForm.value);

    this.loader = true;
    this.employeesPanelService.createTaskForSelf(payload).subscribe(res => {

      this.loader = false;
      this.showTaskModal = false;
      this.showToastr(true, "Task created successfully!");
      this.getEmployeeTasks();
    }, err => {

      this.loader = false;
      this.showToastr(false, err, true);
    });
  }

  getEmployeeTasks(): void {

    const filtersString: string = JSON.stringify(this.filters);
    this.spinner.show();
    this.employeesPanelService.getEmployeeTasks(filtersString).subscribe(res => {

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
      ]
    });
  }

  setEditTaskModal(task: any): void {

    this.taskId = task._id;
    this.actionType = actionTypes.EDIT;
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      status: task.status
    });
    this.showTaskModal = true;
  }

  editTask(): void {

    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }
    let payload = Object.assign({}, this.taskForm.value);
    this.loader = true;
    this.employeesPanelService.updateTask(this.taskId, payload).subscribe(res => {

      this.loader = false;
      this.showTaskModal = false;
      this.showToastr(true, "Task updated successfully!");
      this.getEmployeeTasks();
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

  showToastr(success: boolean, info: any, sticky: boolean = false): void {

    this.messageService.clear()
    if (success) {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: info, sticky });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: info.message || info, sticky });
    }
  }
}