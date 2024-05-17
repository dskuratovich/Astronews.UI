import { Component, OnInit } from "@angular/core";
import { SearchService } from "../search.service";
import { Subject, debounceTime } from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public isLightTheme = false;
  public searchTerm: string = '';
  searchSubject = new Subject<string>();

  constructor(private searchService: SearchService) { }
  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(570)
    ).subscribe(searchText => {
      this.searchService.setSearchTerm(searchText);
    });
  }

  toggleTheme() {
    this.isLightTheme = !this.isLightTheme;

    document.body.setAttribute(
      'data-theme',
      this.isLightTheme ? 'light' : 'dark'
    );
  }

  clearSearch() {
    this.searchService.setSearchTerm('');
    this.searchTerm = '';
  }
}