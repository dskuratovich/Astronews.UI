import { Component, OnInit } from '@angular/core';
import { GalleryModel } from '../models/gallery.model';
import { DataService } from '../data.service';

@Component({
  selector: 'app-nasa-gallery',
  templateUrl: './nasa-gallery.component.html',
  styleUrls: ['./nasa-gallery.component.scss']
})
export class NasaGalleryComponent implements OnInit {
  data: GalleryModel[] = [];

  constructor(private apiCaller: DataService) { }

  ngOnInit(): void {
    this.apiCaller.getNasaGallery().subscribe(result => { this.data = result; });
  }
}
