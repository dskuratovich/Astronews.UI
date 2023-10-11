import { Component, OnInit } from '@angular/core';
import { NewsModel } from '../models/news.model';
import { DataService } from '../data.service';
import { ErrorService } from '../error.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ApiKeyService } from '../api-key.service';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  data: NewsModel[] = [];

  constructor(private apiCaller: DataService,
    private errorService: ErrorService, private router: Router,
    private authService: AuthService, private apiKeyService: ApiKeyService) { }

  ngOnInit(): void {
    if (this.apiKeyService.getApiKey() === '') {
      this.authService.fetchApiKey().pipe(
        tap(response => {
          this.apiKeyService.setApiKey(response);
        }),
        switchMap(() => this.apiCaller.getNews())
      ).subscribe({
        next: (v) => this.data = v,
        error: (e) => {
          this.errorService.sendError('Error occured during fetching the data. Please, try again shortly.');
          this.router.navigate(['/Error']);
        }
      });
    } else {
      this.apiCaller.getNews().subscribe({
        next: (v) => this.data = v,
        error: (e) => {
          this.errorService.sendError('Error occured during fetching the data. Please, try again shortly.');
          this.router.navigate(['/Error']);
        }
      });
    }
  }
}
