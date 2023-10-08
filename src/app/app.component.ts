import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { interval, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Astronews.UI';

  constructor(private authService : AuthService){}

  ngOnInit(): void {
    interval(3_600_000)
    .pipe(
      startWith(0),
      switchMap(() => this.authService.fetchToken())
    ).subscribe();
  }
}
