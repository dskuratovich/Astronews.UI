import { Component, OnInit } from '@angular/core';
import { ErrorService } from '../error.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  errorMessage: string | undefined;

  constructor(private errorService: ErrorService) { }

  ngOnInit(): void {
    this.errorService.errorMessage$.subscribe(message => { this.errorMessage = message });
  }
}
