import { Component, OnInit } from '@angular/core';
import { ApodModel } from '../models/apod.model';
import { DataService } from '../data.service';
import { ErrorService } from '../error.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SearchService } from '../search.service';
import { parseSearchTerm } from '../search.util';

@Component({
  selector: 'app-apod',
  templateUrl: './apod.component.html',
  styleUrls: ['./apod.component.scss']
})
export class APODComponent implements OnInit {
  data: ApodModel[] = [];
  filteredData: ApodModel[] = [];
  date: Date;

  constructor(private apiCaller: DataService,
    private errorService: ErrorService, private router: Router,
    private sanitizer: DomSanitizer, private searchService: SearchService) {
    this.date = new Date();
    this.searchService.searchTerm$.subscribe(term => {
      const { property, value } = parseSearchTerm(term);
      if (property) {
        switch (property) {
          case "t":
            this.filteredData = this.data.filter(item => item.title.includes(value));
            break;
          case "e":
            this.filteredData = this.data.filter(item => item.explanation.includes(value));
            break;
          case "c":
            this.filteredData = this.data.filter(item => item.copyright.includes(value));
            break;
          case "d":
            this.filteredData = this.data.filter(item => item.date.includes(value));
            break;
          default:
            this.filteredData = this.data;
            break;
        }
      }
    });
  }

  ngOnInit(): void {
    let yearEnd = this.convertDateToString(this.date);
    this.date.setMonth(this.date.getMonth() - 1)
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
      },
      error: (e) => {
        this.errorService.sendError('Error occured during fetching the data. Please, try again shortly.');
        this.router.navigate(['/Error']);
      }
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
