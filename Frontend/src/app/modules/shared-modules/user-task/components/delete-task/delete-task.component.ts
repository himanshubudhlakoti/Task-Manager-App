import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UserTasksService } from "../../services/user-tasks.service";
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-delete-task',
  templateUrl: './delete-task.component.html',
  styleUrls: ['./delete-task.component.scss']
})
export class DeleteTaskComponent implements OnInit {

  @Input() taskId: string | null = null;
  @Output() taskDeletedTriggered = new EventEmitter<void>();
  public selectedId: string | null = null;
  public showConfirmationModal: boolean = false;
  public loader: boolean = false;
  public deleteTaskSubs: any = null;

  constructor(private userTasksService: UserTasksService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
  }

  openConfirmModal(taskId: string | null): void {

    this.showConfirmationModal = true;
    this.selectedId = taskId;
  }

  deleteTask(): void {

    if (!this.selectedId) {
      return;
    }
    this.loader = true;
    this.deleteTaskSubs = this.userTasksService.deleteTask(this.selectedId)
      .subscribe(
        () => {
          this.loader = false;
          this.showConfirmationModal = false
          this.showToastr(true, "Task Deleted!", true);
          this.getRefresedData();

        },
        (err) => {
          this.loader = false;
          this.showToastr(false, err, true);
        }
      );
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

  private getRefresedData(): void {

    this.taskDeletedTriggered.emit(); // notify parent
  }

  ngOnDestroy(): void {
    if (this.deleteTaskSubs) {
      this.deleteTaskSubs.unsubscribe();
    }
  }
}
