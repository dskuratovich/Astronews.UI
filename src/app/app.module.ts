import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NewsComponent } from './news/news.component';
import { MarsPhotosComponent } from './mars-photos/mars-photos.component';
import { NasaGalleryComponent } from './nasa-gallery/nasa-gallery.component';
import { APODComponent } from './apod/apod.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NewsComponent,
    MarsPhotosComponent,
    NasaGalleryComponent,
    APODComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
