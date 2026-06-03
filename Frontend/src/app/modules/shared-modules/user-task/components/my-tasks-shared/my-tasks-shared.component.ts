import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskStatuses } from 'src/app/libs/constants/enums';
import { MessageService } from 'primeng/api';
import { UserTasksService } from "../../services/user-tasks.service";
import { IFilters } from "src/app/libs/interfaces";
import { paginationSettings } from "src/app/libs/constants";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TCustomObj } from 'src/app/libs/types';
import { NgxSpinnerService } from "ngx-spinner";
import { EmployeesPanelService } from '../../../../auth-modules/employees-panel/services/employees-panel.service';

enum actionTypes {
  CREATE = 'create',
  EDIT = 'edit'
}

@Component({
  selector: 'app-my-tasks-shared',
  templateUrl: './my-tasks-shared.component.html',
  styleUrls: ['./my-tasks-shared.component.scss']
})
export class MyTasksSharedComponent implements OnInit {

  public pendingTasks: any[] = [];
  public inProgressTasks: any[] = [];
  public completedTasks: any[] = [];
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
  private destroy$ = new Subject<void>();
  public taskId: string = '';
  public actionType: actionTypes = actionTypes.CREATE;
  public actionTypes: typeof actionTypes = actionTypes;
  public showTaskModal: boolean = false;
  public loader: boolean = false;
  public taskForm!: FormGroup;
  public statusList = [
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
      value: TaskStatuses.COMPLETED
    }
  ];
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private userTasksService: UserTasksService,
    private spinner: NgxSpinnerService,
    private employeesPanelService: EmployeesPanelService
  ) { }

  ngOnInit(): void {
    this.taskForm = this.getTaskFrom();
    this.getEmployeeTasks();
  }

  setEditTaskModal(task: TCustomObj): void {

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
    const payload = { ...this.taskForm.value };
    this.loader = true;

    this.userTasksService.updateTask(this.taskId, payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.loader = false;
          this.closeTaskModal();
          this.showToastr(true, 'Task updated successfully!');
          this.getRefreshedData();
        },
        (err) => {
          this.loader = false;
          this.showToastr(false, err, true);
        }
      );
  }

  closeTaskModal(): void {
    this.showTaskModal = false;
  }

  openCreateTaskModal(): void {

    this.actionType = actionTypes.CREATE;
    this.taskForm.reset({
      status: TaskStatuses.PENDING
    });
    this.showTaskModal = true;
  }

  createTaskForSelf(): void {

    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }
    const payload = { ...this.taskForm.value };
    this.loader = true;

    this.userTasksService.createTaskForSelf(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.loader = false;
          this.closeTaskModal();
          this.showToastr(true, 'Task created successfully!');
          this.getRefreshedData();
        },
        (err) => {
          this.loader = false;
          this.showToastr(false, err, true);
        }
      );
  }

  private getEmployeeTasks(): void {

    const filtersString: string = JSON.stringify(this.filters);
    this.spinner.show();
    this.employeesPanelService.getEmployeeTasks(filtersString)
      .pipe(takeUntil(this.destroy$)).subscribe(res => {

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
        this.pendingTasks = [];
        this.inProgressTasks = [];
        this.completedTasks = [];
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

  private getRefreshedData(): void {

    this.getEmployeeTasks();
  }

  private showToastr(success: boolean, info: any, sticky: boolean = false): void {

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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}