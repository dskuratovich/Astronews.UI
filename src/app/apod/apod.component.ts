import { Component, OnInit } from '@angular/core';
import { ApodModel } from '../models/apod.model';
import { DataService } from '../data.service';
import { ErrorService } from '../error.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ApiKeyService } from '../api-key.service';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-apod',
  templateUrl: './apod.component.html',
  styleUrls: ['./apod.component.scss']
})
export class APODComponent implements OnInit {
  data: ApodModel[] = [];

  constructor(private apiCaller: DataService,
    private errorService: ErrorService, private router: Router,
    private authService: AuthService, private apiKeyService: ApiKeyService) { }

  ngOnInit(): void {
    if (this.apiKeyService.getApiKey() === '') {
      this.authService.fetchApiKey().pipe(
        tap(response => {
          this.apiKeyService.setApiKey(response);
        }),
        switchMap(() => this.apiCaller.getApods())
      ).subscribe({
        next: (v) => this.data = v,
        error: (e) => {
          this.errorService.sendError('Error occured during fetching the data. Please, try again shortly.');
          this.router.navigate(['/Error']);
        }
      });
    }
    else {
      this.apiCaller.getApods().subscribe({
        next: (v) => this.data = v,
        error: (e) => {
          this.errorService.sendError('Error occured during fetching the data. Please, try again shortly.');
          this.router.navigate(['/Error']);
        }
      });
    }
  }
}
