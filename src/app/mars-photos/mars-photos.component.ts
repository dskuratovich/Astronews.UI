import { Component, OnInit } from '@angular/core';
import { MarsModel } from '../models/mars.model';
import { DataService } from '../data.service';
import { ErrorService } from '../error.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mars-photos',
  templateUrl: './mars-photos.component.html',
  styleUrls: ['./mars-photos.component.scss']
})
export class MarsPhotosComponent implements OnInit {
  data: MarsModel[] = [];

  constructor(private apiCaller: DataService,
    private errorService: ErrorService, private router: Router) { }

  ngOnInit(): void {
    this.apiCaller.getMarsPhotos().subscribe({
      next: (v) => this.data = v,
      error: (e) => {
        this.errorService.sendError('Error occured during fetching the data. Please, try again shortly.');
        this.router.navigate(['/Error']);
      }
    });
  }
}
