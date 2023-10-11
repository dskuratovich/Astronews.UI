import { Component, OnInit } from '@angular/core';
import { GalleryModel } from '../models/gallery.model';
import { DataService } from '../data.service';
import { ErrorService } from '../error.service';
import { Router } from '@angular/router';
import { ApiKeyService } from '../api-key.service';
import { AuthService } from '../auth.service';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-nasa-gallery',
  templateUrl: './nasa-gallery.component.html',
  styleUrls: ['./nasa-gallery.component.scss']
})
export class NasaGalleryComponent implements OnInit {
  data: GalleryModel[] = [];

  constructor(private apiCaller: DataService,
    private errorService: ErrorService, private router: Router,
    private authService: AuthService, private apiKeyService: ApiKeyService) { }

  ngOnInit(): void {
    if (this.apiKeyService.getApiKey() === '') {
      this.authService.fetchApiKey().pipe(
        tap(response => {
          this.apiKeyService.setApiKey(response);
        }),
        switchMap(() => this.apiCaller.getNasaGallery())
      ).subscribe({
        next: (v) => this.data = v,
        error: (e) => {
          this.errorService.sendError('Error occured during fetching the data. Please, try again shortly.');
          this.router.navigate(['/Error']);
        }
      });
    } else {
      this.apiCaller.getNasaGallery().subscribe({
        next: (v) => this.data = v,
        error: (e) => {
          this.errorService.sendError('Error occured during fetching the data. Please, try again shortly.');
          this.router.navigate(['/Error']);
        }
      });
    }
  }
}
