import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ErrorService } from '../error.service';
import { Router } from '@angular/router';
import { Data } from '../models/gallery.root.model';
import { PromptService } from '../prompt.service';
import { SearchService } from '../search.service';
import { parseSearchTerm } from '../search.util';

@Component({
  selector: 'app-nasa-gallery',
  templateUrl: './nasa-gallery.component.html',
  styleUrls: ['./nasa-gallery.component.scss']
})
export class NasaGalleryComponent implements OnInit {
  data: Data[] = [];
  filteredData: Data[] = [];

  constructor(private apiCaller: DataService,
    private errorService: ErrorService, private router: Router,
    private promptService: PromptService, private searchService: SearchService) {
    this.searchService.searchTerm$.subscribe(term => {
      const { property, value } = parseSearchTerm(term);
      if (value == '') {
        this.filteredData = this.data;
      }
      if (property) {
        switch (property) {
          case "t":
            this.filteredData = this.data.filter(item => item.data[0].title.includes(value));
            break;
          case "d":
            this.filteredData = this.data.filter(item => item.data[0].description.includes(value));
            break;
          case "c":
            this.filteredData = this.data.filter(item => item.data[0].center.includes(value));
            break;
          case "dc":
            this.filteredData = this.data.filter(item => item.data[0].date_created.includes(value));
            break;
          default:
            this.filteredData = this.data;
            break;
        }
      }
    });
  }

  ngOnInit(): void {
    this.apiCall('');
  }

  onScrollDown(): void {
    this.apiCall(this.promptService.LibraryNext);
  }

  apiCall(url: string): void {
    this.apiCaller.getNasaGallery(url).subscribe({
      next: (v) => {
        this.data = [...this.data, ...v.collection.items];
        this.filteredData = this.data;
        for (let link of v.collection.links) {
          if (link.prompt == 'Next') {
            this.promptService.LibraryNext = link.href;
            break;
          }
        }
      },
      error: (e) => {
        this.errorService.sendError('Error occured during fetching the data. Please, try again shortly.');
        this.router.navigate(['/Error']);
      }
    });
  }
}
