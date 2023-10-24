import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MarsModel } from './models/mars.model';
import { ApodModel } from './models/apod.model';
import { NewsRootModel } from './models/news.root.model';
import { GalleryRootModel } from './models/gallery.root.model';
import { ApiKeyService } from './api-key.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private newsEndpoint = environment.api.newsEndpoint;
  private nasaEndpoint = environment.api.nasaEndpoint;
  private marsCuriosityEndpoint = environment.api.marsCuriosityEndpoint;
  private marsOpportunityEndpoint = environment.api.marsOpportunityEndpoint;
  private marsSpiritEndpoint = environment.api.marsSpiritEndpoint;
  private apodEndpoint = environment.api.apodEndpoint;

  constructor(private http: HttpClient, private apiKeyService: ApiKeyService) { }

  getNews(url: string): Observable<NewsRootModel> {
    if (!url) {
      let requestUrl = this.newsEndpoint.concat(`?limit=60&offset=0`);
      return this.http.get<NewsRootModel>(requestUrl).pipe(catchError(this.handleError));
    }
    return this.http.get<NewsRootModel>(url).pipe(catchError(this.handleError));
  }

  getNasaGallery(url: string): Observable<GalleryRootModel> {
    let date = new Date();
    let utcYear = date.getUTCFullYear();
    if (!url) {
      let requestUrl = this.nasaEndpoint.concat(`?year_start=${utcYear}&page_size=50`);
      return this.http.get<GalleryRootModel>(requestUrl).pipe(catchError(this.handleError));

    }
    return this.http.get<GalleryRootModel>(url).pipe(catchError(this.handleError));
  }

  getCuriosityMarsPhotos(sol: number, url: string): Observable<MarsModel[]> {
    let apiKey = this.apiKeyService.getApiKey();
    if(!url) {
          let requestUrl = this.marsCuriosityEndpoint.concat(`?sol=${sol}&api_key=${apiKey}`);
    return this.http.get<MarsModel[]>(requestUrl).pipe(catchError(this.handleError));

    }
    return this.http.get<MarsModel[]>(url).pipe(catchError(this.handleError));
  }

  getOpportunityMarsPhotos(sol: number, url: string): Observable<MarsModel[]> {
    let apiKey = this.apiKeyService.getApiKey();
    if(!url) {
        let requestUrl = this.marsOpportunityEndpoint.concat(`?sol=${sol}&api_key=${apiKey}`);
    return this.http.get<MarsModel[]>(requestUrl).pipe(catchError(this.handleError));
  
    }
    return this.http.get<MarsModel[]>(url).pipe(catchError(this.handleError));
  }

  getSpiritMarsPhotos(sol: number, url: string): Observable<MarsModel[]> {
    let apiKey = this.apiKeyService.getApiKey();
    if(!url) {
          let requestUrl = this.marsSpiritEndpoint.concat(`?sol=${sol}&api_key=${apiKey}`);
    return this.http.get<MarsModel[]>(requestUrl).pipe(catchError(this.handleError));

    }
    return this.http.get<MarsModel[]>(url).pipe(catchError(this.handleError));
  }

  getApods(url: string): Observable<ApodModel[]> {
    if(!url) {
         return this.http.get<ApodModel[]>(this.apodEndpoint).pipe(catchError(this.handleError));
    }
    return this.http.get<ApodModel[]>(url).pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred: ', error);

    return throwError(() => new Error('Couldn\'t retrieve data; please try again later.'));
  }


}
