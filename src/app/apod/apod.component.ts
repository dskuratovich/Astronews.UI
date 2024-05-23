import { Component } from '@angular/core';
import { ApodModel } from '../models/apod.model';
import { DataService } from '../data.service';
import { ErrorService } from '../error.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SearchService } from '../search.service';
import { parseSearchTerm } from '../search.util';
import { CachingService } from '../caching.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-apod',
  templateUrl: './apod.component.html',
  styleUrls: ['./apod.component.scss'],
})
export class APODComponent {
  data: ApodModel[] = [];
  date: Date;
  isDataUpdated: boolean = false;

  constructor(
    private apiCaller: DataService,
    private errorService: ErrorService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private searchService: SearchService,
    private cacheService: CachingService
  ) {
    this.date = new Date();
    this.searchService.searchTerm$.subscribe((term) => this.filterData(term));
  }

  private filterData(term: string): void {
    const { property, value } = parseSearchTerm(term);
    if (property === null && value != '') {
      let cache = this.cacheService.get(value);

      if (cache && !this.isDataUpdated) {
        this.data = cache;
      } else {
        this.data = this.cacheService
          .get('apod')
          .filter(
            (item: ApodModel) =>
              item.title.toLowerCase().includes(value.toLowerCase()) ||
              item.explanation.toLowerCase().includes(value.toLowerCase())
          );

        this.cacheService.set(value, this.data);
        this.isDataUpdated = false;
      }
    }
    if (property === null && value == '') {
      let cache = this.cacheService.get('apod');

      if (cache) {
        this.data = cache;
      } else {
        let yearEnd = this.convertDateToString(this.date);
        this.date.setMonth(this.date.getMonth() - 1);
        let yearStart = this.convertDateToString(this.date);
        this.apiCall(yearStart, yearEnd);
      }
    }
    if (property != null && value != '') {
      switch (property?.toLowerCase()) {
        case 't':
          let cache_t = this.cacheService.get(term);

          if (cache_t && !this.isDataUpdated) {
            this.data = cache_t;
          } else {
            this.data = this.cacheService
              .get('apod')
              .filter((item: ApodModel) =>
                item.title.toLowerCase().includes(value.toLowerCase())
              );
            this.cacheService.set(term, this.data);
            this.isDataUpdated = false;
          }
          break;
        case 'e':
          let cache_e = this.cacheService.get(term);

          if (cache_e && !this.isDataUpdated) {
            this.data = cache_e;
          } else {
            this.data = this.cacheService
              .get('apod')
              .filter((item: ApodModel) =>
                item.explanation.toLowerCase().includes(value.toLowerCase())
              );
            this.cacheService.set(term, this.data);
            this.isDataUpdated = false;
          }
          break;
        case 'c':
          let cache_c = this.cacheService.get(term);

          if (cache_c && !this.isDataUpdated) {
            this.data = cache_c;
          } else {
            this.data = this.cacheService
              .get('apod')
              .filter((item: ApodModel) =>
                item.copyright.toLowerCase().includes(value.toLowerCase())
              );
            this.cacheService.set(term, this.data);
            this.isDataUpdated = false;
          }
          break;
        case 'd':
          let cache_d = this.cacheService.get(term);

          if (cache_d && !this.isDataUpdated) {
            this.data = cache_d;
          } else {
            this.data = this.cacheService
              .get('apod')
              .filter((item: ApodModel) => item.date.includes(value));
            this.cacheService.set(term, this.data);
            this.isDataUpdated = false;
          }
          break;
        default:
          this.data = this.cacheService.get('apod');
          break;
      }
    }
  }

  onScrollDown(): void {
    this.date.setDate(this.date.getDate() - 1);
    let yearEnd = this.convertDateToString(this.date);
    this.date.setMonth(this.date.getMonth() - 1);
    let yearStart = this.convertDateToString(this.date);
    this.apiCall(yearStart, yearEnd);
  }

  async apiCall(yearStart: string, yearEnd: string): Promise<void> {
    try {
      const responseData$ = this.apiCaller.getApods(yearStart, yearEnd);
      const responseData = await lastValueFrom(responseData$);

      let cache = this.cacheService.get('apod');

      if (cache) {
        cache = [...cache, ...responseData];
        this.cacheService.set('apod', cache);
      } else {
        this.cacheService.set('apod', responseData);
      }
      this.isDataUpdated = true;

      this.filterData(this.searchService.getSearchTerm());
    } catch (error) {
      this.errorService.sendError(
        'Error occurred during fetching the data. Please, try again shortly.'
      );
      this.router.navigate(['/Error']);
    }
  }

  convertDateToString(givenDate: Date): string {
    let year = givenDate.getFullYear();
    let month = String(givenDate.getMonth() + 1).padStart(2, '0');
    let day = String(givenDate.getDate()).padStart(2, '0');

    let yearString = `${year}-${month}-${day}`;
    return yearString;
  }

  isYouTubeLink(url: string): boolean {
    return url.includes('youtube.com') || url.includes('youtu.be');
  }

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
