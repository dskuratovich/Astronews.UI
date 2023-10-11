import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private endpoint = environment.api.apikeyEndpoint;

  constructor(private http: HttpClient) { }

  fetchApiKey(): Observable<string> {
    return this.http.get<{ apikey: string, message: string }>(this.endpoint).pipe(map(response => response.apikey));
  }
}
