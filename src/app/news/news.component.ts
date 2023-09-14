import { Component, OnInit } from '@angular/core';
import { NewsModel } from '../models/news.model';
import { DataService } from '../data.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  data: NewsModel[] = [];

  constructor(private apiCaller: DataService) { }

  ngOnInit(): void {
    this.apiCaller.getNews().subscribe(result => { this.data = result; });
  }
}
