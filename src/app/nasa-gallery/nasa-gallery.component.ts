import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ErrorService } from '../error.service';
import { Router } from '@angular/router';
import { Data } from '../models/gallery.root.model';
import { PromptService } from '../prompt.service';

@Component({
  selector: 'app-nasa-gallery',
  templateUrl: './nasa-gallery.component.html',
  styleUrls: ['./nasa-gallery.component.scss']
})
export class NasaGalleryComponent implements OnInit {
  data: Data[] = [];

  constructor(private apiCaller: DataService,
    private errorService: ErrorService, private router: Router,
    private promptService: PromptService) { }

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
        console.log(this.data);
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
