import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { NewsModel } from './models/news.model';
import { GalleryModel } from './models/gallery.model';
import { MarsModel } from './models/mars.model';
import { ApodModel } from './models/apod.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  newsEndpoint = environment.api.newsEndpoint;
  nasaEndpoint = environment.api.nasaEndpoint;
  marsEndpoint = environment.api.marsEndpoint;
  apodEndpoint = environment.api.apodEndpoint;

  constructor(private http: HttpClient) { }

  getNews(): Observable<NewsModel[]> {
    return this.http.get<NewsModel[]>(this.newsEndpoint).pipe(catchError(this.handleError));
  }

  getNasaGallery(): Observable<GalleryModel[]> {
    return this.http.get<GalleryModel[]>(this.nasaEndpoint).pipe(catchError(this.handleError));
  }

  getMarsPhotos(): Observable<MarsModel[]> {
    return this.http.get<MarsModel[]>(this.marsEndpoint).pipe(catchError(this.handleError));
  }

  getApods(): Observable<ApodModel[]> {
    return this.http.get<ApodModel[]>(this.apodEndpoint).pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred: ', error);

    return throwError(() => new Error('Couldn\'t retrieve data; please try again later.'));
  }
}
