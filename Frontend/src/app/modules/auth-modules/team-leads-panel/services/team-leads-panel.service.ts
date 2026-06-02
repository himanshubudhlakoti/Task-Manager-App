import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { errorHandler } from "src/app/libs/functions/res.handler";


@Injectable({
  providedIn: 'root'
})
export class TeamLeadsPanelService {

  constructor(private http: HttpClient) { }

  createTaskByEmployee(payload: object): Observable<any> {
    return this.http.post(`${environment.serverUrl}tasks/create-task-by-employee`, payload).pipe(catchError(errorHandler));
  }

  createTaskForSelf(payload: object): Observable<any> {
    return this.http.post(`${environment.serverUrl}tasks/create-task-for-self`, payload).pipe(catchError(errorHandler));
  }

  assignATaskToEmployeeByTeamLead(payload: object): Observable<any> {
    return this.http.post(`${environment.serverUrl}tasks/assign-task-to-employee-by-team-lead`, payload).pipe(catchError(errorHandler));
  }

  getTeamLeadEmployees(): Observable<any> {
    return this.http.get(`${environment.serverUrl}users/get-team-lead-employees`).pipe(catchError(errorHandler));
  }

  getEmployeeTasksById(employeeId: string, filters: string): Observable<any> {
    return this.http.get(`${environment.serverUrl}tasks/get-employee-tasks-by-id/${employeeId}?filters=${filters}`).pipe(catchError(errorHandler));
  }
}