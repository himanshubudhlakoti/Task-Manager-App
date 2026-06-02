import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { UserRoles } from 'src/app/libs/constants/enums';


@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  private currentUserRole = new BehaviorSubject<UserRoles | null>(null);

  constructor() { }

  setCurrentUserRoleToShare(currentUserRole: UserRoles | null) {
    this.currentUserRole.next(currentUserRole);
  }

  getCurrentUserRoleFromShare(): Observable<UserRoles | null> {
    return this.currentUserRole.asObservable();
  }
}
