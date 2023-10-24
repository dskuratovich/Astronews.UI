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
  data: NewsModel[] = [];

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
        this.data = [...this.data, ...v.results];
        this.promptService.NewsNext = v.next;
      },
      error: (e) => {
        this.errorService.sendError('Error occured during fetching the data. Please, try again shortly.');
        this.router.navigate(['/Error']);
      }
    });
  }
}
