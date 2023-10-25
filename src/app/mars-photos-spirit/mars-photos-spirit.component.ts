import { Component, OnInit } from '@angular/core';
import { MarsModel } from '../models/mars.model';
import { DataService } from '../data.service';
import { ErrorService } from '../error.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mars-photos-spirit',
  templateUrl: './mars-photos-spirit.component.html',
  styleUrls: ['./mars-photos-spirit.component.scss']
})
export class MarsPhotosSpiritComponent implements OnInit {
  data: MarsModel[] = [];
  sol: number = 1;

  constructor(private apiCaller: DataService, private errorService: ErrorService, private router: Router) { }

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
    this.apiCaller.getSpiritMarsPhotos(this.sol).subscribe({
      next: (v) => {
        this.data = [...this.data, ...v.photos];
      },
      error: (e) => {
        this.errorService.sendError('Error occured during fetching the data. Please, try again shortly.');
        this.router.navigate(['/Error']);
      }
    });
  }
}
