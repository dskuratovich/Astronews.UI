import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from '@/app/components';

@Component({
  selector: 'app-page-container',
  templateUrl: './page-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    HeaderComponent,
  ],
})
export class PageContainerComponent {
}
