import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { NewsModel } from './models/news.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getNews(): Observable<NewsModel[]> {
    return this.http.get<NewsModel[]>(`${this.apiUrl}/news`).pipe(catchError(this.handleError));
  }

  getNasaGallery(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/nasa-library`).pipe(catchError(this.handleError));
  }

  getMarsPhotos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/mars-rover-photos`).pipe(catchError(this.handleError));
  }

  getApods(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/apod`).pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred: ', error);

    return throwError(() => new Error('Couldn\'t retrieve data; please try again later.'));
  }
}
