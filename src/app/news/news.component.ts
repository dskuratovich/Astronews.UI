import { Component, OnInit } from '@angular/core';
import { NewsModel } from '../models/news.model';
import { DataService } from '../data.service';
import { ErrorService } from '../error.service';
import { Router } from '@angular/router';
import { PromptService } from '../prompt.service';
import { SearchService } from '../search.service';
import { parseSearchTerm, parseSearchValue } from '../search.util';
import { UrlBuilderService } from '../url-builder.service';
import { CachingService } from '../caching.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit {
  filteredData: NewsModel[] = [];

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
      if (!property) {
        let cache = cacheService.get(value);

        if (cache) {
          this.filteredData = cache;
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
      if (value == '') {
        let cache = cacheService.get('news');

        if (cache) {
          this.filteredData = cache;
        } else {
          this.clearApiCall(this.urlBuilder.getNewsUrl(), 'news');
        }
      }
      switch (property?.toLowerCase()) {
        case 't':
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
          break;
        case 'ns':
          let urlNS = urlBuilder.getNewsUrl(undefined, parseSearchValue(value));
          this.clearApiCall(urlNS, value);
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
          this.clearApiCall(urlS, value);
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
            this.clearApiCall(urlP, value);
          }
          break;
        case 'pb':
          let urlPB = urlBuilder.getNewsUrl(
            undefined,
            undefined,
            undefined,
            value
          );
          this.clearApiCall(urlPB, value);
          break;
        case 'ba':
          let urlPA = urlBuilder.getNewsUrl(undefined, undefined, value);
          this.clearApiCall(urlPA, value);
          break;
        default:
          let cache = cacheService.get('news');

          if (cache) {
            this.filteredData = cache;
          } else {
            this.clearApiCall(this.urlBuilder.getNewsUrl(), 'news');
          }
          break;
      }
    });
  }

  ngOnInit(): void {
    //this.apiCall(this.urlBuilder.getNewsUrl());
  }

  onScrollDown(): void {
    this.apiCall(this.promptService.NewsNext);
  }

  apiCall(url: string): void {
    this.apiCaller.getNews(url).subscribe({
      next: (v) => {
        //this.data = [...this.data, ...v.results];
        // this.filteredData = this.data;
        this.filteredData = [...this.filteredData, ...v.results];
        this.promptService.NewsNext = v.next;
        this.cacheService.set('news', this.filteredData);
      },
      error: (e) => {
        this.errorService.sendError(
          'Error occured during fetching the data. Please, try again shortly.'
        );
        this.router.navigate(['/Error']);
      },
    });
  }

  clearApiCall(url: string, key: string): void {
    this.apiCaller.getNews(url).subscribe({
      next: (v) => {
        this.filteredData = v.results;
        this.promptService.NewsNext = v.next;
        this.cacheService.set(key, this.filteredData);
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
//Add a text element to the page when empty list is returned (for example when searching for specific news, but there is nothing to show)
//Fix scrolldown
