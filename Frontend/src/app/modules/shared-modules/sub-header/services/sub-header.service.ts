import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SubHeaderService {

  constructor(private http: HttpClient) { }
}


