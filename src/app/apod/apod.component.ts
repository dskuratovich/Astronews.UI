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
    console.log('Constructor started his work');
    this.date = new Date();
    this.searchService.searchTerm$.subscribe((term) => this.filterData(term));
    console.log('Constructor ended his work');
  }

  private filterData(term: string): void {
    console.log('filterData started its work');
    const { property, value } = parseSearchTerm(term);
    if (property === null && value != '') {
      console.log("1: Property is null, value isn't");
      let cache = this.cacheService.get(value);

      if (cache && !this.isDataUpdated) {
        this.data = cache;
        console.log('1: Cache is used');
      } else {
        console.log("1: Cache isn't used");
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
      console.log('2: Property is null, value is empty');
      let cache = this.cacheService.get('apod');

      if (cache) {
        console.log('2: Cache is used');
        this.data = cache;
      } else {
        console.log("2: Cache isn't used");
        let yearEnd = this.convertDateToString(this.date);
        this.date.setMonth(this.date.getMonth() - 1);
        let yearStart = this.convertDateToString(this.date);
        this.apiCall(yearStart, yearEnd);
      }
    }
    if (property != null && value != '') {
      console.log("3: Property isn't null (prefix entered), value isn't empty");
      switch (property?.toLowerCase()) {
        case 't':
          console.log('3: Prefix = t');
          let cache_t = this.cacheService.get(term);

          if (cache_t && !this.isDataUpdated) {
            console.log('3: Prefix = t, cache used');
            this.data = cache_t;
          } else {
            console.log("3: Prefix = t, cache isn't used");
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
          console.log('3: default option used, apod cache applied');
          this.data = this.cacheService.get('apod');
          break;
      }
    }
  }

  onScrollDown(): void {
    console.log('onScrolldown start');
    this.date.setDate(this.date.getDate() - 1);
    let yearEnd = this.convertDateToString(this.date);
    this.date.setMonth(this.date.getMonth() - 1);
    let yearStart = this.convertDateToString(this.date);
    this.apiCall(yearStart, yearEnd);
    console.log('onScrollDown end');
  }

  async apiCall(yearStart: string, yearEnd: string): Promise<void> {
    try {
      console.log('apiCall start');

      const responseData$ = this.apiCaller.getApods(yearStart, yearEnd);
      const responseData = await lastValueFrom(responseData$);

      let cache = this.cacheService.get('apod');

      if (cache) {
        console.log("cache isn't empty, retrieving cache, joining new data");
        cache = [...cache, ...responseData];
        this.cacheService.set('apod', cache);
      } else {
        console.log('cache is empty, creating new variable, saving to cache');
        let data: any = [];
        data = [...data, ...responseData];
        this.cacheService.set('apod', data);
      }
      this.isDataUpdated = true;

      console.log('calling filterData from apiCall');
      this.filterData(this.searchService.getSearchTerm());
      console.log('apiCall end');
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
//implement showing the text when there's is nothing to show