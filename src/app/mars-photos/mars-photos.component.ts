import { Component, OnInit } from '@angular/core';
import { MarsModel } from '../models/mars.model';
import { DataService } from '../data.service';
import { ErrorService } from '../error.service';
import { Router } from '@angular/router';
import { ApiKeyService } from '../api-key.service';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-mars-photos',
  templateUrl: './mars-photos.component.html',
  styleUrls: ['./mars-photos.component.scss']
})
export class MarsPhotosComponent implements OnInit {
  data: MarsModel[] = [];

  constructor(private apiCaller: DataService,
    private errorService: ErrorService, private router: Router, private apiKeyService: ApiKeyService) { }

  ngOnInit(): void {
    
  }
}
