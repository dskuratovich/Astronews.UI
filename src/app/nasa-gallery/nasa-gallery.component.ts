import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { ErrorService } from '../error.service';
import { Router } from '@angular/router';
import { Data } from '../models/gallery.root.model';
import { PromptService } from '../prompt.service';
import { SearchService } from '../search.service';
import { parseSearchTerm } from '../search.util';
import { UrlBuilderService } from '../url-builder.service';
import { CachingService } from '../caching.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-nasa-gallery',
  templateUrl: './nasa-gallery.component.html',
  styleUrls: ['./nasa-gallery.component.scss'],
})
export class NasaGalleryComponent {
  data: Data[] = [];
  isDataUpdated: boolean = false;

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
      if (property === null && value != '') {
        let cache = cacheService.get(value);

        if (cache) {
          this.data = cache;
        } else {
          let url = urlBuilder.getGalleryUrl(undefined, value);
          this.clearApiCall(url, value);
        }
      }
      if (property === null && value == '') {
        let cache = cacheService.get('gallery');

        if (cache) {
          this.data = cache;
        } else {
          this.clearApiCall(this.urlBuilder.getGalleryUrl(), 'gallery');
        }
      }
      if (property != null && value != '') {
        switch (property?.toLowerCase()) {
          case 't':
            let cache_t = this.cacheService.get(term);

            if (cache_t && !this.isDataUpdated) {
              this.data = cache_t;
            } else {
              let urlT = urlBuilder.getGalleryUrl(
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                value
              );
              this.clearApiCall(urlT, value);
            }
            break;
          case 'd':
            let cache_d = this.cacheService.get(term);

            if (cache_d && !this.isDataUpdated) {
              this.data = cache_d;
            } else {
              let urlD = urlBuilder.getGalleryUrl(
                undefined,
                undefined,
                undefined,
                value
              );
              this.clearApiCall(urlD, value);
            }
            break;
          case 'c':
            let cache_c = this.cacheService.get(term);

            if (cache_c && !this.isDataUpdated) {
              this.data = cache_c;
            } else {
              let urlC = urlBuilder.getGalleryUrl(undefined, undefined, value);
              this.clearApiCall(urlC, value);
            }
            break;
          case 'dc':
            let cache_dc = this.cacheService.get(term);

            if (cache_dc && !this.isDataUpdated) {
              this.data = cache_dc;
            } else {
              let urlDC = urlBuilder.getGalleryUrl(
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                value
              );
              this.clearApiCall(urlDC, value);
            }
            break;
          default:
            let cache = cacheService.get('gallery');

            if (cache) {
              this.data = cache;
            } else {
              this.clearApiCall(this.urlBuilder.getGalleryUrl(), 'gallery');
            }
            break;
        }
      }
    });
  }

  onScrollDown(): void {
    this.apiCall(this.promptService.LibraryNext);
  }

  async apiCall(url: string): Promise<void> {
    try {
      const responseData$ = this.apiCaller.getNasaGallery(url);
      const responseData = await lastValueFrom(responseData$);

      let cache = this.cacheService.get('gallery');

      if (cache) {
        cache = [...cache, ...responseData.collection.items];
        this.cacheService.set('gallery', cache);
        this.data = cache;
      } else {
        this.cacheService.set('gallery', responseData.collection.items);
      }
      this.isDataUpdated = true;
    } catch (error) {
      this.errorService.sendError(
        'Error occurred during fetching the data. Please, try again shortly.'
      );
      this.router.navigate(['/Error']);
    }
  }

  clearApiCall(url: string, key: string): void {
    this.apiCaller.getNasaGallery(url).subscribe({
      next: (v) => {
        this.data = v.collection.items;

        for (let link of v.collection.links) {
          if (link.prompt == 'Next') {
            this.promptService.LibraryNext = link.href;
            break;
          }
        }

        this.cacheService.set(key, this.data);
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
