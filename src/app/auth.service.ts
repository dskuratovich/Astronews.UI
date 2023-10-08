import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public readonly token$: Observable<string> = this.tokenSubject.asObservable();

  private API_ENDPOINT = environment.api.loginEndpoint;
  private credentials = {
    username: environment.api.login,
    password: environment.api.password
  };

  constructor(private httpClient: HttpClient) { }

  fetchToken(): Observable<{token : string}> {
    return this.httpClient.post<{ token: string; }>(this.API_ENDPOINT, this.credentials)
      .pipe(tap(response => {
        this.tokenSubject.next(response.token);
        localStorage.setItem('token', response.token);
        environment.token = response.token
      }));
  }

  getToken(): string {
    return this.tokenSubject.value;
  }
}
