import { Component, OnInit } from '@angular/core';
import { MarsModel } from '../models/mars.model';
import { DataService } from '../data.service';
import { ErrorService } from '../error.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ApiKeyService } from '../api-key.service';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-mars-photos',
  templateUrl: './mars-photos.component.html',
  styleUrls: ['./mars-photos.component.scss']
})
export class MarsPhotosComponent implements OnInit {
  data: MarsModel[] = [];

  constructor(private apiCaller: DataService,
    private errorService: ErrorService, private router: Router,
    private authService: AuthService, private apiKeyService: ApiKeyService) { }

  ngOnInit(): void {
    if (this.apiKeyService.getApiKey() === '') {
      this.authService.fetchApiKey().pipe(
        tap(response => {
          this.apiKeyService.setApiKey(response);
        }),
        switchMap(() => this.apiCaller.getMarsPhotos())
      ).subscribe({
        next: (v) => this.data = v,
        error: (e) => {
          this.errorService.sendError('Error occured during fetching the data. Please, try again shortly.');
          this.router.navigate(['/Error']);
        }
      });
    } else {
      this.apiCaller.getMarsPhotos().subscribe({
        next: (v) => this.data = v,
        error: (e) => {
          this.errorService.sendError('Error occured during fetching the data. Please, try again shortly.');
          this.router.navigate(['/Error']);
        }
      });
    }
  }
}
