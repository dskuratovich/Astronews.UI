import { Component, OnInit } from '@angular/core';
import { ApodModel } from '../models/apod.model';
import { DataService } from '../data.service';
import { ErrorService } from '../error.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-apod',
  templateUrl: './apod.component.html',
  styleUrls: ['./apod.component.scss']
})
export class APODComponent implements OnInit {
  data: ApodModel[] = [];

  constructor(private apiCaller: DataService,
    private errorService: ErrorService, private router: Router) { }

  ngOnInit(): void {
    this.apiCaller.getApods().subscribe({
      next: (v) => this.data = v,
      error: (e) => {
        this.errorService.sendError('Error occured during fetching the data. Please, try again shortly.');
        this.router.navigate(['/Error']);
      }
    });
  }
}
