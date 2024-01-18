import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {YouTubePlayer} from '@angular/youtube-player';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  @ViewChild('youtubePlayer', { static: true }) youtubePlayer?: YouTubePlayer | undefined;
  currentPlayTime:number = 0;
  highlightedTimestamp: number = 0;
  highlightTranscriptInterval: any;

  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  transcript?: {transcript: [{text:string,start:number, duration:number}], is_generated: boolean};

  constructor(private http: HttpClient){}


  ngOnInit() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    this.http.post<any>('http://127.0.0.1:5000/video',{
      "video_id":"dBF65_kHdNg",
      "lang":"de"
    }).subscribe(result => {
      // console.log(result);
      this.transcript = result;
    })      
  }  


  onPlayerStateChange(event:any){
    console.log("does this work?");
    if(event?.data === YT.PlayerState.PLAYING){
      this.highlightTranscriptInterval = setInterval(() => {
        this.currentPlayTime = this.youtubePlayer?.getCurrentTime() ?? 0;
        this.highlightCaption()
      },500)
    }else{
      clearInterval(this.highlightTranscriptInterval);
    }
  }

  getWordTranslation(word: string){
    this.http.post<any>('http://127.0.0.1:5000/vocabulary/context',{
      "word":word
    }).subscribe(result => {
      console.log("translation", result);
    })      
  }

  changeTimeStamp(timestamp: number){
    // this.startSecond = 500;

    const player: any = this.youtubePlayer;
    player.seekTo(timestamp);
    player.playVideo();
  }

  highlightCaption(){
    // console.log(this.currentPlayTime)
    this.highlightedTimestamp = this.transcript?.transcript.find(caption => caption.start <= this.currentPlayTime && this.currentPlayTime <= (caption.start + caption.duration))?.start ?? this.highlightedTimestamp;    
    console.log(this.highlightedTimestamp)
  }

  breakSentence(sentence: string){
    // console.log("sentence ", sentence);
    return sentence.split(' ');
  }

  formatSecondsToMinutes(seconds: number) {
    // Convert seconds to minutes
    let minutes = Math.floor(seconds / 60);
    // Calculate the remaining seconds
    let remainingSeconds = Math.round(seconds % 60);

    // Ensure that both minutes and seconds are two digits
    let formattedMinutes = String(minutes).padStart(2, '0');
    let formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return the formatted time in "00:00" format
    return `${formattedMinutes}:${formattedSeconds}`;
}

}
