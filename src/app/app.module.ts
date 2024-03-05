import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {YouTubePlayerModule} from '@angular/youtube-player';
import { HttpClientModule } from '@angular/common/http';
import { YtVideoComponent } from './components/yt-video/yt-video.component';
import { CaptionsComponent } from './components/captions/captions.component';
import { LearnComponent } from './pages/learn/learn.component';

@NgModule({
  declarations: [
    AppComponent,
    YtVideoComponent,
    CaptionsComponent,
    LearnComponent
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
