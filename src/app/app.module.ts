import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {YouTubePlayerModule} from '@angular/youtube-player';
import { HttpClientModule } from '@angular/common/http';
import { YtVideoComponent } from './components/yt-video/yt-video.component';
import { CaptionsComponent } from './components/captions/captions.component';
import { LearnComponent } from './pages/learn/learn.component';
import { ControllerComponent } from './components/controller/controller.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VocabularyComponent } from './components/vocabulary/vocabulary.component';
import { LoginComponent } from './pages/login/login.component';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AppLayoutComponent } from './pages/app-layout/app-layout/app-layout.component';
import { NavComponent } from './components/nav/nav.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';


@NgModule({
  declarations: [
    AppComponent,
    YtVideoComponent,
    CaptionsComponent,
    LearnComponent,
    ControllerComponent,
    VocabularyComponent,
    LoginComponent,
    HomeComponent,
    AppLayoutComponent,
    NavComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    YouTubePlayerModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
