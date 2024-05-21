import { Component, OnInit } from '@angular/core';
import { ApodModel } from '../models/apod.model';
import { DataService } from '../data.service';
import { ErrorService } from '../error.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SearchService } from '../search.service';
import { parseSearchTerm } from '../search.util';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-apod',
  templateUrl: './apod.component.html',
  styleUrls: ['./apod.component.scss'],
})
export class APODComponent implements OnInit {
  private data: ApodModel[] = [];
  filteredData: ApodModel[] = [];
  date: Date;

  constructor(
    private apiCaller: DataService,
    private errorService: ErrorService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private searchService: SearchService
  ) {
    this.date = new Date();
    this.searchService.searchTerm$.subscribe((term) => this.filterData(term));
  }

  private filterData(term: string): void {
    const { property, value } = parseSearchTerm(term);
    if (property === null && value != '') {
      this.filteredData = this.data.filter(
        (item) =>
          item.title.toLowerCase().includes(value.toLowerCase()) ||
          item.explanation.toLowerCase().includes(value.toLowerCase())
      );
    }
    if (property === null && value == '') {
      this.filteredData = this.data;
    }
    if (property != null && value != '') {
      switch (property?.toLowerCase()) {
        case 't':
          this.filteredData = this.data.filter((item) =>
            item.title.toLowerCase().includes(value.toLowerCase())
          );
          break;
        case 'e':
          this.filteredData = this.data.filter((item) =>
            item.explanation.toLowerCase().includes(value.toLowerCase())
          );
          break;
        case 'c':
          this.filteredData = this.data.filter((item) =>
            item.copyright.toLowerCase().includes(value.toLowerCase())
          );
          break;
        case 'd':
          this.filteredData = this.data.filter((item) =>
            item.date.includes(value)
          );
          break;
        default:
          this.filteredData = this.data;
          break;
      }
    }
  }

  ngOnInit(): void {
    let yearEnd = this.convertDateToString(this.date);
    this.date.setMonth(this.date.getMonth() - 1);
    let yearStart = this.convertDateToString(this.date);
    this.apiCall(yearStart, yearEnd);
  }

  onScrollDown(): void {
    this.date.setDate(this.date.getDate() - 1);
    let yearEnd = this.convertDateToString(this.date);
    this.date.setMonth(this.date.getMonth() - 1);
    let yearStart = this.convertDateToString(this.date);
    this.apiCall(yearStart, yearEnd);
  }

  apiCall(yearStart: string, yearEnd: string): void {
    this.apiCaller.getApods(yearStart, yearEnd).subscribe({
      next: (v) => {
        this.data = [...this.data, ...v];
        this.filterData(this.searchService.getSearchTerm());
      },
      error: (e) => {
        this.errorService.sendError(
          'Error occurred during fetching the data. Please, try again shortly.'
        );
        this.router.navigate(['/Error']);
      },
    });
  }

  convertDateToString(givenDate: Date): string {
    let year = givenDate.getFullYear();
    let month = String(givenDate.getMonth() + 1).padStart(2, '0');
    let day = String(givenDate.getDate()).padStart(2, '0');

    let yearString = `${year}-${month}-${day}`;
    return yearString;
  }

  isYouTubeLink(url: string): boolean {
    return url.includes('youtube.com') || url.includes('youtu.be');
  }

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
