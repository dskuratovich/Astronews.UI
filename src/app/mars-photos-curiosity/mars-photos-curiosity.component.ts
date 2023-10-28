import { Component, OnInit } from '@angular/core';
import { MarsModel } from '../models/mars.model';
import { DataService } from '../data.service';
import { ErrorService } from '../error.service';
import { Router } from '@angular/router';
import { SearchService } from '../search.service';
import { parseSearchTerm } from '../search.util';

@Component({
  selector: 'app-mars-photos',
  templateUrl: './mars-photos-curiosity.component.html',
  styleUrls: ['./mars-photos-curiosity.component.scss']
})
export class MarsPhotosCuriosityComponent implements OnInit {
  data: MarsModel[] = [];
  filteredData: MarsModel[] = [];
  sol: number = 1;

  constructor(private apiCaller: DataService,
    private errorService: ErrorService, private router: Router,
    private searchService: SearchService) {
      this.searchService.searchTerm$.subscribe(term => {
        const { property, value } = parseSearchTerm(term);
        if(property){
          switch(property){
            case "s":
              this.filteredData = this.data.filter(item => item.sol.toString() == value);
              break;
            case "cn":
              this.filteredData = this.data.filter(item => item.camera.name.includes(value) || item.camera.full_name.includes(value));
              break;
            case "ed":
              this.filteredData = this.data.filter(item => item.earth_date.includes(value));
              break;
            case "st":
              this.filteredData =this.data.filter(item => item.rover.status.includes(value));
              break;
            default:
              this.filteredData = this.data;
              break;
          }
        }
      });
    }

  ngOnInit(): void {
    this.apiCall();
  }

  onScrollDown(): void {
    if (this.sol < this.data[0].rover.max_sol) {
      this.sol++;
      this.apiCall();
    }
  }

  apiCall(): void {
    this.apiCaller.getCuriosityMarsPhotos(this.sol).subscribe({
      next: (v) => {
        this.data = [...this.data, ...v.photos];
        this.filteredData = this.data;
      },
      error: (e) => {
        this.errorService.sendError('Error occured during fetching the data. Please, try again shortly.');
        this.router.navigate(['/Error']);
      }
    });
  }
}
