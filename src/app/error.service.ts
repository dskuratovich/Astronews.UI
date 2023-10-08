import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private errorSubject = new ReplaySubject<string>(1);
  errorMessage$ = this.errorSubject.asObservable();

  constructor() { }

  sendError(message: string){
    this.errorSubject.next(message);
  }
}
