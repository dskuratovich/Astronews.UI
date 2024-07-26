import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public isLightTheme = false;
  public searchTerm: string = '';
  public isVisible = false;

  searchSubject = new Subject<string>();

  constructor(private searchService: SearchService) {}
  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(730)).subscribe((searchText) => {
      this.searchService.setSearchTerm(searchText);
    });
  }

  public toggleTheme() {
    this.isLightTheme = !this.isLightTheme;

    document.body.setAttribute(
      'data-theme',
      this.isLightTheme ? 'light' : 'dark'
    );
  }

  public clearSearch() {
    this.searchService.setSearchTerm('');
    this.searchTerm = '';
  }

  public toggleMenu() {
    this.isVisible = !this.isVisible;
  }

  public onMenuVisibilityChange() {
    this.toggleMenu();
  }

  public onLightThemeChange(value: boolean) {
    this.isLightTheme = value;
  }
}
