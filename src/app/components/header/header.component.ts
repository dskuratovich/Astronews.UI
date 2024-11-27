import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { NgForOf, NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface HeaderLink {
  label: string;
  route: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatToolbar,
    NgOptimizedImage,
    RouterLink,
    NgForOf,
    RouterLinkActive,
  ],
})
export class HeaderComponent {
  readonly links: HeaderLink[] = [
    { label: 'News', route: '/news' },
    { label: 'Curiosity', route: '/mars/curiosity' },
    { label: 'NASA', route: '/gallery' },
    { label: 'APOD', route: '/apod' },
  ];
}
