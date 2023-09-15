import { Component, OnInit } from '@angular/core';
import { MarsModel } from '../models/mars.model';
import { DataService } from '../data.service';

@Component({
  selector: 'app-mars-photos',
  templateUrl: './mars-photos.component.html',
  styleUrls: ['./mars-photos.component.scss']
})
export class MarsPhotosComponent implements OnInit {
  data: MarsModel[] = [];

  constructor(private apiCaller: DataService) { }

  ngOnInit(): void {
    this.apiCaller.getMarsPhotos().subscribe(result => { this.data = result; });
  }
}
