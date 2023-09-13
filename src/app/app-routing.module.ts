import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewsComponent } from 'src/app/news/news.component';
import { NasaGalleryComponent } from './nasa-gallery/nasa-gallery.component';
import { MarsPhotosComponent } from './mars-photos/mars-photos.component';
import { APODComponent } from './apod/apod.component';
 
const routes: Routes = [
  { path: 'News', component: NewsComponent },
  { path: 'NasaGallery', component: NasaGalleryComponent },
  { path: 'MarsPhotos', component: MarsPhotosComponent },
  { path: 'APOD', component:APODComponent }
  { path: '', redirectTo: '/News', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
