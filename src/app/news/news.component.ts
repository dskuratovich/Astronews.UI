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
import { NewsCache } from '../models/news-cache-model';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent {
  data: NewsModel[] = [];
  private cacheKeyword: string = '';
  isSearchMode: boolean = false;
  isDataAvailable: boolean = false;
  private currentUrl: string = '/News';

  constructor(
    private apiCaller: DataService,
    private errorService: ErrorService,
    private router: Router,
    private promptService: PromptService,
    private searchService: SearchService,
    urlBuilder: UrlBuilderService,
    private cacheService: CachingService
  ) {
    this.searchService.searchTerm$.subscribe((term) => {
      if (term && term.length > 2) {
        const { property, value } = parseSearchTerm(term);
        this.isSearchMode = value !== '';

        if (this.isSearchMode && property != null) {
          this.cacheKeyword = term;

          switch (property?.toLowerCase()) {
            case 't':
              let cache_t = this.cacheService.get(this.cacheKeyword);

              if (cache_t) {
                this.data = cache_t.data;
                this.promptService.NewsNext = cache_t.nextUrl;
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

                this.clearApiCall(urlT, this.cacheKeyword);
              }
              break;
            case 'ns':
              let cache_ns = this.cacheService.get(this.cacheKeyword);

              if (cache_ns) {
                this.data = cache_ns.data;
                this.promptService.NewsNext = cache_ns.nextUrl;
              } else {
                let urlNS = urlBuilder.getNewsUrl(
                  undefined,
                  parseSearchValue(value)
                );

                this.clearApiCall(urlNS, this.cacheKeyword);
              }
              break;
            case 's':
              let cache_s = this.cacheService.get(this.cacheKeyword);

              if (cache_s) {
                this.data = cache_s.data;
                this.promptService.NewsNext = cache_s.nextUrl;
              } else {
                let urlS = urlBuilder.getNewsUrl(
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  parseSearchValue(value)
                );

                this.clearApiCall(urlS, this.cacheKeyword);
              }
              break;
            case 'p':
              let cache_p = this.cacheService.get(this.cacheKeyword);

              if (cache_p) {
                this.data = cache_p.data;
                this.promptService.NewsNext = cache_p.nextUrl;
              } else {
                let dates = parseSearchValue(value);
                if (dates.length == 2) {
                  let urlP = urlBuilder.getNewsUrl(
                    undefined,
                    undefined,
                    dates[0],
                    dates[1]
                  );

                  this.clearApiCall(urlP, this.cacheKeyword);
                }
              }
              break;
            case 'pb':
              let cache_pb = this.cacheService.get(this.cacheKeyword);

              if (cache_pb) {
                this.data = cache_pb.data;
                this.promptService.NewsNext = cache_pb.nextUrl;
              } else {
                let urlPB = urlBuilder.getNewsUrl(
                  undefined,
                  undefined,
                  undefined,
                  value
                );

                this.clearApiCall(urlPB, this.cacheKeyword);
              }
              break;
            case 'pa':
              let cache_pa = this.cacheService.get(this.cacheKeyword);

              if (cache_pa) {
                this.data = cache_pa.data;
                this.promptService.NewsNext = cache_pa.nextUrl;
              } else {
                let urlPA = urlBuilder.getNewsUrl(undefined, undefined, value);

                this.clearApiCall(urlPA, this.cacheKeyword);
              }
              break;
            default:
              let default_url = urlBuilder.getNewsUrl();
              let cache = cacheService.get(default_url);

              if (cache) {
                this.data = cache.data;
                this.promptService.NewsNext = cache.nextUrl;
              } else {
                this.clearApiCall(default_url, default_url);
              }
              break;
          }
        } else if (this.isSearchMode) {
          this.cacheKeyword = value;
          let cache = cacheService.get(value);

          if (cache) {
            this.data = cache.data;
            this.promptService.NewsNext = cache.nextUrl;
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
      } else {
        let urlEmpty = urlBuilder.getNewsUrl();
        this.cacheKeyword = urlEmpty;
        let cache = cacheService.get(this.cacheKeyword);

        if (cache) {
          this.data = cache.data;
          this.promptService.NewsNext = cache.nextUrl;
        } else {
          this.clearApiCall(urlEmpty, this.cacheKeyword);
        }
      }
    });
  }

  async onScrollDown() {
    if (!this.isSearchMode) {
      await this.apiCall(this.promptService.NewsNext, this.cacheKeyword);
    }
  }

  private async apiCall(url: string, key: string): Promise<void> {
    if (!url) {
      this.isDataAvailable = false;
      return;
    }
    try {
      const responseData = await lastValueFrom(this.apiCaller.getNews(url));

      if (responseData.results.length == 0) {
        return;
      }

      if (responseData.next != url) {
        this.data = [...this.data, ...responseData.results];
        this.promptService.NewsNext = responseData.next;
        let newsCache: NewsCache;
        newsCache = { nextUrl: responseData.next, data: this.data };
        this.cacheService.set(key, newsCache);
        responseData.next
          ? (this.isDataAvailable = true)
          : (this.isDataAvailable = false);
      }
    } catch (error) {
      this.errorService.sendError(
        'Error occured during data fetch on News page. Please, try again shortly.'
      );
      this.router.navigate(['/Error'], { state: { returnUrl: this.currentUrl } });
    }
  }

  private clearApiCall(url: string, key: string): void {
    this.apiCaller.getNews(url).subscribe({
      next: (v) => {
        this.data = v.results;
        this.promptService.NewsNext = v.next;
        let newsCache: NewsCache;
        newsCache = { nextUrl: v.next, data: v.results };
        this.cacheService.set(key, newsCache);
        v.next ? (this.isDataAvailable = true) : (this.isDataAvailable = false);
      },
      error: (e) => {
        this.errorService.sendError(
          'Error occured during clearing API call on News page. Please, try again shortly.'
        );
        this.router.navigate(['/Error'], { state: { returnUrl: this.currentUrl } });
      },
    });
  }

  async nextPage() {
    await this.apiCall(this.promptService.NewsNext, this.cacheKeyword);
  }
}
