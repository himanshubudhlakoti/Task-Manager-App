import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { errorHandler } from "src/app/libs/functions/res.handler";

@Injectable({
  providedIn: 'root'
})
export class UserTasksService {

  constructor(private http: HttpClient) { }

  createTaskForSelf(payload: object): Observable<any> {
    return this.http.post(`${environment.serverUrl}tasks/create-task-for-self`, payload).pipe(catchError(errorHandler));
  }

  updateTask(taskId: string, payload: object): Observable<any> {
    return this.http.patch(`${environment.serverUrl}tasks/update-task/${taskId}`, payload).pipe(catchError(errorHandler));
  }
}
