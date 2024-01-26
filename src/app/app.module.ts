import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {YouTubePlayerModule} from '@angular/youtube-player';
import { HttpClientModule } from '@angular/common/http';
import { YtVideoComponent } from './features/yt-video/yt-video.component';
import { CaptionsComponent } from './features/captions/captions.component';

@NgModule({
  declarations: [
    AppComponent,
    YtVideoComponent,
    CaptionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    YouTubePlayerModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
