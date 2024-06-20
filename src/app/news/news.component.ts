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
      if (term && term.length > 2) {
        const { property, value } = parseSearchTerm(term);
        this.isSearchMode = value !== '';

        if (this.isSearchMode && property != null) {
          this.cacheKeyword = term;

          console.log('property and value are not null');
          switch (property?.toLowerCase()) {
            case 't':
              console.log(value);
              let urlT = urlBuilder.getNewsUrl(
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                parseSearchValue(value)
              );

              let cache_t = this.cacheService.get(this.cacheKeyword);

              if (cache_t) {
                this.data = cache_t.data;
                this.promptService.NewsNext = cache_t.nextUrl;
              } else {
                this.clearApiCall(urlT, this.cacheKeyword);
              }
              break;
            case 'ns':
              let urlNS = urlBuilder.getNewsUrl(
                undefined,
                parseSearchValue(value)
              );

              let cache_ns = this.cacheService.get(this.cacheKeyword);

              if (cache_ns) {
                this.data = cache_ns.data;
                this.promptService.NewsNext = cache_ns.nextUrl;
              } else {
                this.clearApiCall(urlNS, this.cacheKeyword);
              }
              break;
            case 's':
              let urlS = urlBuilder.getNewsUrl(
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                parseSearchValue(value)
              );

              let cache_s = this.cacheService.get(this.cacheKeyword);

              if (cache_s) {
                this.data = cache_s.data;
                this.promptService.NewsNext = cache_s.nextUrl;
              } else {
                this.clearApiCall(urlS, this.cacheKeyword);
              }
              break;
            case 'p':
              let dates = parseSearchValue(value);
              if (dates.length == 2) {
                let urlP = urlBuilder.getNewsUrl(
                  undefined,
                  undefined,
                  dates[0],
                  dates[1]
                );

                let cache_p = this.cacheService.get(this.cacheKeyword);

                if (cache_p) {
                  this.data = cache_p.data;
                  this.promptService.NewsNext = cache_p.nextUrl;
                } else {
                  this.clearApiCall(urlP, this.cacheKeyword);
                }
              }
              break;
            case 'pb':
              let urlPB = urlBuilder.getNewsUrl(
                undefined,
                undefined,
                undefined,
                value
              );

              let cache_pb = this.cacheService.get(this.cacheKeyword);

              if (cache_pb) {
                this.data = cache_pb.data;
                this.promptService.NewsNext = cache_pb.nextUrl;
              } else {
                this.clearApiCall(urlPB, this.cacheKeyword);
              }
              break;
            case 'ba':
              let urlPA = urlBuilder.getNewsUrl(undefined, undefined, value);

              let cache_ba = this.cacheService.get(this.cacheKeyword);

              if (cache_ba) {
                this.data = cache_ba.data;
                this.promptService.NewsNext = cache_ba.nextUrl;
              } else {
                this.clearApiCall(urlPA, this.cacheKeyword);
              }
              break;
            default:
              console.log('default case');
              let default_url = this.urlBuilder.getNewsUrl();
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
          console.log('property null, value is not');
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
        console.log('all is null, default empty search bar');
        let urlEmpty = this.urlBuilder.getNewsUrl();
        this.cacheKeyword = urlEmpty;
        let cache = cacheService.get(urlEmpty);

        if (cache) {
          this.data = cache.data;
          this.promptService.NewsNext = cache.nextUrl;
        } else {
          this.clearApiCall(urlEmpty, urlEmpty);
        }
      }
    });
  }

  async onScrollDown() {
    if (!this.isSearchMode) {
      console.log('onScrollDown triggered');
      await this.apiCall(this.promptService.NewsNext, this.cacheKeyword);
    }
  }

  async apiCall(url: string, key: string): Promise<void> {
    console.log('apiCall made');
    try {
      const responseData = await lastValueFrom(this.apiCaller.getNews(url));

      if (responseData.results.length == 0) {
        return;
      }

      if (responseData.next != url) {
        this.data = [...this.data, ...responseData.results];
        //using url for cache key won't work
        //after onScrollDown url will change
        //leading to saving new cache
        //and not using an old one
        this.promptService.NewsNext = responseData.next;
        let newsCache: NewsCache;
        newsCache = { nextUrl: responseData.next, data: this.data };
        this.cacheService.set(key, newsCache);
      }
    } catch (error) {
      this.errorService.sendError(
        'Error occured during fetching the data. Please, try again shortly.'
      );
      this.router.navigate(['/Error']);
    }
  }

  clearApiCall(url: string, key: string): void {
    console.log('clearApiCall made');
    this.apiCaller.getNews(url).subscribe({
      next: (v) => {
        this.data = v.results;
        this.promptService.NewsNext = v.next;
        let newsCache: NewsCache;
        newsCache = { nextUrl: v.next, data: v.results };
        this.cacheService.set(key, newsCache);
      },
      error: (e) => {
        this.errorService.sendError(
          'Error occured during fetching the data. Please, try again shortly.'
        );
        this.router.navigate(['/Error']);
      },
    });
  }

  async nextPage() {
    await this.apiCall(this.promptService.NewsNext, this.cacheKeyword);
    //when the last available data is retrieved from API,
    //next button click leads to requesting the same last data
    //in other words, after reaching the end data starts to loop
  }
}
