import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError, } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { errorHandler } from "src/app/libs/functions/res.handler";


@Injectable({
  providedIn: 'root'
})
export class MainLayoutService {
  private toggleUpdate = new Subject<boolean>();

  constructor(private http: HttpClient) { }

  getUserProfile(): Observable<any> {
    return this.http.get(environment.serverUrl + 'auths/get-user-profile',).pipe(catchError(errorHandler));
  }

  toggleChange(value: any) {
    this.toggleUpdate.next(value);
  }

  getToggle(): Observable<boolean> {
    return this.toggleUpdate.asObservable();
  }
}




