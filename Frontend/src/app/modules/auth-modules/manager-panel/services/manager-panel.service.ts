import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, } from 'rxjs/operators';

import { environment } from '../../../../../environments/environment';
import { errorHandler } from "src/app/libs/functions/res.handler";
import { UserRoles } from 'src/app/libs/constants/enums';

@Injectable({
  providedIn: 'root'
})
export class ManagerPanelService {

  constructor(private http: HttpClient) { }

  getUsersList(role: UserRoles, filters: string): Observable<any> {
    return this.http.get(`${environment.serverUrl}users/get-users-list/${role}?filters=${filters}`).pipe(catchError(errorHandler));
  }

  assignLeader(payload: object): Observable<any> {
    return this.http.patch(`${environment.serverUrl}users/assign-leader`, payload).pipe(catchError(errorHandler));
  }

  getTeamLeads(): Observable<any> {
    return this.http.get(`${environment.serverUrl}users/get-team-leads`).pipe(catchError(errorHandler));
  }

  getTeamLeadTasksById(teamLeadId: string): Observable<any> {
    return this.http.get(`${environment.serverUrl}tasks/get-team-lead-tasks-by-id/${teamLeadId}`).pipe(catchError(errorHandler));
  }
}