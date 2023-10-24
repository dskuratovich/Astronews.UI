import { Component, OnInit } from '@angular/core';
import { NewsModel } from '../models/news.model';
import { DataService } from '../data.service';
import { ErrorService } from '../error.service';
import { Router } from '@angular/router';
import { PromptService } from '../prompt.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  originalData: NewsModel[] = [];
  sortedData: NewsModel[] = [];
  sortOrder: 'asc' | 'desc' | 'default' = 'default';

  constructor(private apiCaller: DataService,
    private errorService: ErrorService, private router: Router,
    private promptService: PromptService) { }

  ngOnInit(): void {
    this.apiCall('');
  }

  onScrollDown(): void {
    this.apiCall(this.promptService.NewsNext);
  }

  apiCall(url: string): void {
    this.apiCaller.getNews(url).subscribe({
      next: (v) => {
        this.originalData = [...this.originalData, ...v.results];
        this.sortedData = [...this.sortedData, ...v.results];
        this.promptService.NewsNext = v.next;
      },
      error: (e) => {
        this.errorService.sendError('Error occured during fetching the data. Please, try again shortly.');
        this.router.navigate(['/Error']);
      }
    });
  }

toggleSort() {
    switch (this.sortOrder) {
      case 'default':
        this.sortOrder = 'asc';
        this.sortedData = this.sortNewsByTitle([...this.originalData], 'asc');
        break;
      case 'asc':
        this.sortOrder = 'desc';
        this.sortedData = this.sortNewsByTitle([...this.originalData], 'desc');
        break;
      case 'desc':
        this.sortOrder = 'default';
        this.sortedData = [...this.originalData];
        break;
    }
  }

  sortNewsByTitle(articles: NewsModel[], direction: 'asc' | 'desc' = 'asc'): NewsModel[] {
    return articles.sort((a, b) => {
      const comparison = a.title.localeCompare(b.title);
      return direction === 'asc' ? comparison : -comparison;
    });
  }
}
