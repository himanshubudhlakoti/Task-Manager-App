
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, } from 'rxjs/operators';
import { environment } from './../../../../environments/environment';
import { errorHandler } from "src/app/libs/functions/res.handler";
import { UserRoles } from "src/app/libs/constants/enums";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  userLogin(payload: object, role: UserRoles): Observable<any> {
    return this.http.post(
      environment.serverUrl + `auths/user-login/${role}`,
      payload,
      {
        withCredentials: true
      }
    ).pipe(catchError(errorHandler));
  }

  signUp(payload: object): Observable<any> {
    return this.http.post(environment.serverUrl + 'auths/add-user', payload).pipe(catchError(errorHandler));
  }
}
