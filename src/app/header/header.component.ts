import { Component, OnInit, Renderer2 } from '@angular/core';
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

  constructor(private searchService: SearchService, private renderer: Renderer2) {}

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
    if (this.isVisible) {
      this.renderer.addClass(document.body, 'no-scroll');
    } else {
      this.renderer.removeClass(document.body, 'no-scroll');
    }
  }

  public onMenuVisibilityChange() {
    this.toggleMenu();
  }

  public onLightThemeChange(value: boolean) {
    this.isLightTheme = value;
  }
}
