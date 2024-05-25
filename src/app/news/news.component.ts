import { Component } from '@angular/core';
import { NewsModel } from '../models/news.model';
import { DataService } from '../data.service';
import { ErrorService } from '../error.service';
import { Router } from '@angular/router';
import { PromptService } from '../prompt.service';
import { SearchService } from '../search.service';
import { parseSearchTerm, parseSearchValue } from '../search.util';
import { UrlBuilderService } from '../url-builder.service';
import { CachingService } from '../caching.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent {
  data: NewsModel[] = [];
  isDataUpdated: boolean = false;

  constructor(
    private apiCaller: DataService,
    private errorService: ErrorService,
    private router: Router,
    private promptService: PromptService,
    private searchService: SearchService,
    private urlBuilder: UrlBuilderService,
    private cacheService: CachingService
  ) {
    this.searchService.searchTerm$.subscribe((term) => {
      const { property, value } = parseSearchTerm(term);
      if (property === null && value != '') {
        let cache = cacheService.get(value);

        if (cache) {
          this.data = cache;
        } else {
          let url = urlBuilder.getNewsUrl(
            undefined,
            undefined,
            undefined,
            undefined,
            value
          );
          this.clearApiCall(url, value);
        }
      }
      if (property === null && value == '') {
        let cache = cacheService.get('news');

        if (cache) {
          this.data = cache;
        } else {
          this.clearApiCall(this.urlBuilder.getNewsUrl(), 'news');
        }
      }
      if (property != null && value != '') {
        switch (property?.toLowerCase()) {
          case 't':
            let cache_t = this.cacheService.get(term);

            if (cache_t && !this.isDataUpdated) {
              this.data = cache_t;
            } else {
              let urlT = urlBuilder.getNewsUrl(
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                parseSearchValue(value)
              );
              this.clearApiCall(urlT, value);
            }
            break;
          case 'ns':
            let cache_ns = this.cacheService.get(term);

            if (cache_ns && !this.isDataUpdated) {
              this.data = cache_ns;
            } else {
              let urlNS = urlBuilder.getNewsUrl(
                undefined,
                parseSearchValue(value)
              );
              this.clearApiCall(urlNS, value);
            }
            break;
          case 's':
            let cache_s = this.cacheService.get(term);

            if (cache_s && !this.isDataUpdated) {
              this.data = cache_s;
            } else {
              let urlS = urlBuilder.getNewsUrl(
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                parseSearchValue(value)
              );
              this.clearApiCall(urlS, value);
            }
            break;
          case 'p':
            let cache_p = this.cacheService.get(term);

            if (cache_p && !this.isDataUpdated) {
              this.data = cache_p;
            } else {
              let dates = parseSearchValue(value);
              if (dates.length == 2) {
                let urlP = urlBuilder.getNewsUrl(
                  undefined,
                  undefined,
                  dates[0],
                  dates[1]
                );
                this.clearApiCall(urlP, value);
              }
            }
            break;
          case 'pb':
            let cache_pb = this.cacheService.get(term);

            if (cache_pb && !this.isDataUpdated) {
              this.data = cache_pb;
            } else {
              let urlPB = urlBuilder.getNewsUrl(
                undefined,
                undefined,
                undefined,
                value
              );
              this.clearApiCall(urlPB, value);
            }
            break;
          case 'ba':
            let cache_ba = this.cacheService.get(term);

            if (cache_ba && !this.isDataUpdated) {
              this.data = cache_ba;
            } else {
              let urlPA = urlBuilder.getNewsUrl(undefined, undefined, value);
              this.clearApiCall(urlPA, value);
            }
            break;
          default:
            let cache = cacheService.get('news');

            if (cache) {
              this.data = cache;
            } else {
              this.clearApiCall(this.urlBuilder.getNewsUrl(), 'news');
            }
            break;
        }
      }
    });
  }

  onScrollDown(): void {
    this.apiCall(this.promptService.NewsNext);
  }

  async apiCall(url: string): Promise<void> {
    try {
      const responseData$ = this.apiCaller.getNews(url);
      const responseData = await lastValueFrom(responseData$);

      let cache = this.cacheService.get('news');

      if (cache) {
        cache = [...cache, ...responseData.results];
        this.cacheService.set('news', cache);
        this.data = cache;
      } else {
        this.cacheService.set('news', responseData.results);
      }
      this.isDataUpdated = true;
    } catch (error) {
      this.errorService.sendError(
        'Error occured during fetching the data. Please, try again shortly.'
      );
      this.router.navigate(['/Error']);
    }
  }

  clearApiCall(url: string, key: string): void {
    this.apiCaller.getNews(url).subscribe({
      next: (v) => {
        this.data = v.results;
        this.promptService.NewsNext = v.next;
        this.cacheService.set(key, this.data);
      },
      error: (e) => {
        this.errorService.sendError(
          'Error occured during fetching the data. Please, try again shortly.'
        );
        this.router.navigate(['/Error']);
      },
    });
  }
}
