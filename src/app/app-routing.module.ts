import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewsComponent } from 'src/app/news/news.component';
import { NasaGalleryComponent } from './nasa-gallery/nasa-gallery.component';
import { MarsPhotosCuriosityComponent } from './mars-photos-curiosity/mars-photos-curiosity.component';
import { APODComponent } from './apod/apod.component';
import { ErrorComponent } from './error/error.component';
import { MarsPhotosOpportunityComponent } from './mars-photos-opportunity/mars-photos-opportunity.component';
import { MarsPhotosSpiritComponent } from './mars-photos-spirit/mars-photos-spirit.component';

const routes: Routes = [
  { path: 'News', component: NewsComponent },
  { path: 'NasaGallery', component: NasaGalleryComponent },
  { path: 'MarsPhotos/Curiosity', component: MarsPhotosCuriosityComponent },
  { path: 'MarsPhotos/Opportunity', component: MarsPhotosOpportunityComponent },
  { path: 'MarsPhotos/Spirit', component: MarsPhotosSpiritComponent },
  { path: 'APOD', component: APODComponent },
  { path: 'Error', component: ErrorComponent },
  { path: '', redirectTo: '/News', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
