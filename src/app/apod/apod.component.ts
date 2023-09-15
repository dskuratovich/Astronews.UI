import { Component, OnInit } from '@angular/core';
import { ApodModel } from '../models/apod.model';
import { DataService } from '../data.service';

@Component({
  selector: 'app-apod',
  templateUrl: './apod.component.html',
  styleUrls: ['./apod.component.scss']
})
export class APODComponent implements OnInit {
  data: ApodModel[] = [];

  constructor(private apiCaller: DataService) { }

  ngOnInit(): void {
    this.apiCaller.getApods().subscribe(result => { this.data = result; });
  }
}
