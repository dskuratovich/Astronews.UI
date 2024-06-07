import { Component } from '@angular/core';
import { MarsModel } from '../models/mars.model';
import { DataService } from '../data.service';
import { ErrorService } from '../error.service';
import { Router } from '@angular/router';
import { SearchService } from '../search.service';
import { parseSearchTerm, parseSearchValue } from '../search.util';
import { Rovers } from '../models/rovers';
import { UrlBuilderService } from '../url-builder.service';
import { CachingService } from '../caching.service';
import { lastValueFrom } from 'rxjs';
import { CuriosityCameras, MarsRoverCameras } from '../models/rover.cameras';

@Component({
  selector: 'app-mars-photos',
  templateUrl: './mars-photos-curiosity.component.html',
  styleUrls: ['./mars-photos-curiosity.component.scss'],
})
export class MarsPhotosCuriosityComponent {
  data: MarsModel[] = [];
  private readonly cache_keyword = 'curiosity';
  private readonly rover_type = Rovers.Curiosity;
  private last_sol: number = 0;
  private sol: number = 0;
  private solDirection: boolean = false;

  constructor(
    private apiCaller: DataService,
    private errorService: ErrorService,
    private router: Router,
    private cacheService: CachingService,
    private urlBuilder: UrlBuilderService,
    private searchService: SearchService
  ) {
    console.log('Constructor started');
    searchService.searchTerm$.subscribe(this.callApiSearch.bind(this));
    console.log('Constructor finished');
  }

  private parseSolDirection(value: string): boolean {
    console.log('parseSolDirectionStarted');
    if (value.trim().startsWith('+') || value.trim().endsWith('+')) {
      return true;
    } else {
      return false;
    }
  }

  private parseCameraName(value: string): MarsRoverCameras | undefined {
    console.log('parseCameraName started');
    switch (value.toUpperCase()) {
      case 'FHAZ':
        return CuriosityCameras.FHAZ;
      case 'RHAZ':
        return CuriosityCameras.RHAZ;
      case 'MAST':
        return CuriosityCameras.MAST;
      case 'CHEMCAM':
        return CuriosityCameras.CHEMCAM;
      case 'MAHLI':
        return CuriosityCameras.MAHLI;
      case 'MARDI':
        return CuriosityCameras.MARDI;
      case 'NAVCAM':
        return CuriosityCameras.NAVCAM;
    }
    return undefined;
  }

  private handleSearch(term: string): string {
    console.log('handle search started');
    const { property, value } = parseSearchTerm(term);
    if (property && value) {
      console.log('property and value contain data');
      switch (property.toLowerCase()) {
        case 's':
          console.log('prefix is s');

          if (value.includes('+') || value.includes('-')) {
            let valueSign = parseSearchValue(value);

            if (valueSign[0].includes('+') || valueSign[0].includes('-')) {
              this.sol = parseInt(valueSign[1]);
              console.log('sol retrieved from second position');
              console.log('sol in handleSearch set to: ' + this.sol);
            } else {
              this.sol = parseInt(valueSign[0]);
              console.log('sol retrieved from first position');
              console.log('sol in handleSearch set to: ' + this.sol);
            }
          } else {
            console.log('value does not contain + or - signs');
            this.sol = parseInt(value);
          }

          this.solDirection = this.parseSolDirection(value);
          return this.urlBuilder.getMarsUrl(
            this.sol.toString(),
            undefined,
            this.rover_type
          );
        case 'cn':
          console.log('prefix is cn');
          console.log('sol is: ' + this.sol);
          return this.urlBuilder.getMarsUrl(
            this.sol.toString(),
            undefined,
            this.rover_type,
            this.parseCameraName(value)
          );
        case 'ed':
          console.log('prefix is ed');
          return this.urlBuilder.getMarsUrl(
            this.sol.toString(),
            value,
            this.rover_type
          );
      }
    } else if (!property && !value) {
      console.log('empty search bar, returning empty string');
      return '';
    } else {
      console.log('prefix is empty, value is not');
      if (this.isISO8601Date(value)) {
        console.log('value is date');
        return this.urlBuilder.getMarsUrl(
          this.sol.toString(),
          value,
          this.rover_type
        );
      } else if (
        !this.isISO8601Date(value) &&
        this.containsOnlyAlphabet(value)
      ) {
        console.log('value is camera');
        return this.urlBuilder.getMarsUrl(
          this.sol.toString(),
          undefined,
          this.rover_type,
          this.parseCameraName(value)
        );
      } else {
        console.log('value is sol');
        return this.urlBuilder.getMarsUrl(value, undefined, this.rover_type);
      }
    }
    console.log('handle search finished');
    return '';
  }

  private async clearApiCall(
    url: string,
    key: string,
    isLatest: boolean
  ): Promise<void> {
    console.log('clearApiCall started');
    try {
      if (isLatest) {
        console.log('latest clearApiCall started');
        const responseData$ = this.apiCaller.getMarsLatestPhotos(url);
        const responseData = await lastValueFrom(responseData$);

        this.data = responseData.latest_photos;
        if (this.data) {
          if (this.data.length > 0) {
            this.last_sol = this.data[0].sol;
            this.sol = this.last_sol;
            console.log('sol in clearApiCall is set to: ' + this.last_sol);
          }
        }
        this.cacheService.set(key, this.data);
      } else {
        console.log('normal clearApiCall started');
        const responseData$ = this.apiCaller.getMarsPhotos(url);
        const responseData = await lastValueFrom(responseData$);

        this.data = responseData.photos;
        console.log('data in normal clearApiCall assigned');
        this.cacheService.set(key, this.data);
      }
    } catch (error) {
      this.errorService.sendError(
        'Error occured during fetching the data. Please, try again shortly.'
      );
      this.router.navigate(['/Error']);
    }
    console.log('clearApiCall finished');
  }

  private async apiCall(url: string): Promise<void> {
    console.log('apiCall started');
    try {
      const responseData$ = this.apiCaller.getMarsPhotos(url);
      const responseData = await lastValueFrom(responseData$);

      if (responseData.photos.length == 0) {
        this.onScrollDown();
      }

      this.data = [...this.data, ...responseData.photos];
      console.log('apiCall data joined to the existing data');

      this.cacheService.set(this.cache_keyword, this.data);
    } catch (error) {
      this.errorService.sendError(
        'Error occurred during fetching the data. Please try again shortly.'
      );
      this.router.navigate(['/Error']);
    }
    console.log('apiCall finished');
  }

  private callApiSearch(term: string) {
    console.log('callApiSearch started');
    let url = this.handleSearch(term);
    console.log(url);
    if (url) {
      this.clearApiCall(url, term, false);
    } else {
      this.clearApiCall(
        this.urlBuilder.getMarsLatestUrl(this.rover_type),
        term,
        true
      );
    }
    console.log('callApiSearch finished');
  }

  onScrollDown(): void {
    console.log('onScrollDown started');
    this.sol += this.solDirection ? 1 : -1;

    if (this.sol < 0) {
      console.log('sol is smaller than 0');
      this.sol = 0;
    }

    let url = this.handleSearch(this.searchService.getSearchTerm());

    console.log('URL from onScrollDown: ' + url);

    if (url) {
      this.apiCall(url);
    } else {
      this.apiCall(
        this.urlBuilder.getMarsUrl(
          this.sol.toString(),
          undefined,
          this.rover_type,
          undefined
        )
      );
    }
    console.log('onScrollDown finished');
  }

  private isISO8601Date(dateString: string): boolean {
    const iso8601Pattern = /^\d{4}-\d{2}-\d{2}$/;

    return iso8601Pattern.test(dateString);
  }

  private containsOnlyAlphabet(input: string): boolean {
    return /^[a-zA-Z]+$/.test(input);
  }
}
