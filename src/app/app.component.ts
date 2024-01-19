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
  
  //TODO: make context type an interface
  context?: {
    adj_meanings: string, 
    adv_meanings: [], 
    noun_meanings: [],
    verb_meanings: [],
    other_meanings: [], 
    is_noun: boolean,     
    examples:[{src:string, trg: string}],
    input: string,
    noun:{
        article:string,
        gender:string,            
    }        
    }

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
      this.transcript = result;
    })      
  }  


  onPlayerStateChange(event:any){
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
    word = word.replace(/[^a-zA-Z0-9]/g, '');
    this.http.post<any>('http://127.0.0.1:5000/vocabulary/context',{
      "word":word
    }).subscribe(result => {
      this.context = result;
    })      
  }

  changeTimeStamp(timestamp: number){
    const player: any = this.youtubePlayer;
    player.seekTo(timestamp);
    player.playVideo();
  }

  highlightCaption(){
    this.highlightedTimestamp = this.transcript?.transcript.find(caption => caption.start <= this.currentPlayTime && this.currentPlayTime <= (caption.start + caption.duration))?.start ?? this.highlightedTimestamp;    
  }

  breakSentence(sentence: string){
    return sentence.split(' ');
  }

  formatSecondsToMinutes(seconds: number) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.round(seconds % 60);

    let formattedMinutes = String(minutes).padStart(2, '0');
    let formattedSeconds = String(remainingSeconds).padStart(2, '0');
    
    return `${formattedMinutes}:${formattedSeconds}`;
}

}
