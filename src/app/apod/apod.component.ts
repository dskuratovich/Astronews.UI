import { Component, OnInit } from '@angular/core';
import { ApodModel } from '../models/apod.model';
import { DataService } from '../data.service';
import { ErrorService } from '../error.service';
import { Router } from '@angular/router';
import { ApiKeyService } from '../api-key.service';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-apod',
  templateUrl: './apod.component.html',
  styleUrls: ['./apod.component.scss']
})
export class APODComponent implements OnInit {
  data: ApodModel[] = [];

  constructor(private apiCaller: DataService,
    private errorService: ErrorService, private router: Router, private apiKeyService: ApiKeyService) { }

  ngOnInit(): void {
    
  }
}
