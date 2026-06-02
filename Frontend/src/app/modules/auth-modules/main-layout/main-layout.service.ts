import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainLayoutService {
  private toggleUpdate = new Subject<boolean>();
  constructor() { }

  toggleChange(value){
    this.toggleUpdate.next(value);
  }
  getToggle(): Observable<boolean>{
    return this.toggleUpdate.asObservable();
  }
}
