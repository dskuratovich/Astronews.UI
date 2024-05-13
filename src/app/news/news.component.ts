import { Component, OnInit } from '@angular/core';
import { NewsModel } from '../models/news.model';
import { DataService } from '../data.service';
import { ErrorService } from '../error.service';
import { Router } from '@angular/router';
import { PromptService } from '../prompt.service';
import { SearchService } from '../search.service';
import { parseSearchTerm } from '../search.util';
import { SourceManagerService } from '../source-manager.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit {
  data: NewsModel[] = [];
  filteredData: NewsModel[] = [];

  constructor(
    private apiCaller: DataService,
    private errorService: ErrorService,
    private router: Router,
    private promptService: PromptService,
    private searchService: SearchService,
    private sourceService: SourceManagerService
  ) {
    this.searchService.searchTerm$.subscribe((term) => {
      const { property, value } = parseSearchTerm(term);
      if (value == '') {
        this.filteredData = this.data;
      }
      if (property) {
        switch (property) {
          case 't':
            this.filteredData = this.data.filter(
              (item) => item.title && item.title.includes(value)
            );
            break;
          case 'ns':
            this.filteredData = this.data.filter(
              (item) => item.news_site && item.news_site.includes(value)
            );
            break;
          case 's':
            this.filteredData = this.data.filter(
              (item) => item.summary && item.summary.includes(value)
            );
            break;
          case 'p':
            this.filteredData = this.data.filter(
              (item) => item.published_at && item.published_at.includes(value)
            );
            break;
          default:
            this.filteredData = this.data;
            break;
        }
      }
    });
  }

  ngOnInit(): void {
    this.apiCall('');
  }

  onScrollDown(): void {
    this.apiCall(this.promptService.NewsNext);
  }

  apiCall(url: string): void {
    this.apiCaller.getNews(url).subscribe({
      next: (v) => {
        this.data = [...this.data, ...v.results];
        this.data = this.filterData(this.data);
        this.filteredData = this.data;
        this.promptService.NewsNext = v.next;
      },
      error: (e) => {
        this.errorService.sendError(
          'Error occured during fetching the data. Please, try again shortly.'
        );
        this.router.navigate(['/Error']);
      },
    });
  }

  filterData(data: NewsModel[]): NewsModel[] {
    let sources = this.sourceService.getBannedSources();

    return data.filter((news) => !sources.includes(news.news_site));
  }
}
