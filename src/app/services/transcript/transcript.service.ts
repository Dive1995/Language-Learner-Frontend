import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, fromEvent, map, startWith, take, tap } from 'rxjs';
import { YoutubeService } from '../youtube/youtube.service';
import { combineLatest } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class TranscriptService {
  _baseUrl: string = 'http://127.0.0.1:5000/video';

  highlightTranscriptInterval: any;
  indexOfCurrentTranscript: number = -1;
  currentPlayTime:number = 0;

  transcript?: {transcript: [{text:string,start:number, duration:number}], is_generated: boolean};
  highlightedTranscript: any = null;

  keyDowns$ = fromEvent<KeyboardEvent>(document, 'keydown');


  constructor(private http: HttpClient, private youtubeService: YoutubeService) { }

  //FIXME: create a model and replace the type
  transcript$ = this.http.post<{transcript: [{text:string,start:number, duration:number}], is_generated: boolean}>(this._baseUrl,{
      "video_id": 'GAhWN9zmEV0', //this.youtubeService.video_id$,
      "lang":"de" //TODO: make language as input array ["de","de-DE"]
    })

  secondTranscript$ = this.http.post<{transcript: [{text:string,start:number, duration:number}], is_generated: boolean}>(this._baseUrl,{
      "video_id": 'GAhWN9zmEV0', //this.youtubeService.video_id$,
      "lang":"en" //TODO: make language as input array ["de","de-DE"]
    })


  timedCaption$ = combineLatest(
    this.youtubeService.currentPlayTime$,
    this.transcript$, 
    this.secondTranscript$
  ).pipe(
    map(([playTime, transcript, secondTranscript]) => {
      let currentCaptionIndex = transcript.transcript.findIndex(caption => caption.start <= playTime && playTime <= (caption.start + caption.duration)) || -1;
      let currentSecondCaptionIndex = secondTranscript.transcript.findIndex(caption => caption.start <= playTime && playTime <= (caption.start + caption.duration)) || -1;
      return {
        transcript: transcript.transcript,
        secondTranscript: secondTranscript.transcript,
        caption: transcript.transcript[currentCaptionIndex]?.text.split(' '),
        secondCaption: secondTranscript.transcript[currentSecondCaptionIndex]?.text.split(' '),
        index: currentCaptionIndex
      }
    })
  )

  timedCaptionWithEvents$ = combineLatest(
    this.keyDowns$,
    this.transcript$,
    this.youtubeService.currentPlayTime$,
  ).pipe(
    map(([event, transcript, playTime]) => {
      let currentCaptionIndex = transcript.transcript.findIndex(caption => caption.start <= playTime && playTime <= (caption.start + caption.duration)) || -1;

      switch (event.key) {
        case 'ArrowLeft':
          currentCaptionIndex -= 1;
          console.log("yt left");
          this.youtubeService.seekVideoTo(transcript.transcript[currentCaptionIndex]?.start)
          break;
        case 'ArrowRight':
          currentCaptionIndex += 1;
          this.youtubeService.seekVideoTo(transcript.transcript[currentCaptionIndex]?.start)
          console.log("yt right");
          break;
        case ' ':
          console.log("yt space");
          this.youtubeService.playHandler()
          break;
        default:
          break;
      }
      return {
        transcript: transcript.transcript[currentCaptionIndex],
        caption: transcript.transcript[currentCaptionIndex]?.text.split(' '),
        index: currentCaptionIndex
      }
    })
  )


  // updateCaption(automatic: boolean = true){
  //   if(automatic){
  //     this.indexOfCurrentTranscript = this.transcript?.transcript.findIndex(caption => caption.start <= this.currentPlayTime && this.currentPlayTime <= (caption.start + caption.duration)) || -1;
  //   }
  
  //   this.highlightedTranscript = this.indexOfCurrentTranscript >= 0 ? this.transcript?.transcript[this.indexOfCurrentTranscript] : null;
  // }
  
  // switchTranscriptTo(track: string): void {
  //   if (!this.transcript) {
  //     return;
  //   }
  
  //   switch (track) {
  //     case 'prev':
  //       if (this.indexOfCurrentTranscript > 0) {
  //         --this.indexOfCurrentTranscript;
  //       }
  //       break;
  
  //     case 'next':
  //       if (this.indexOfCurrentTranscript < this.transcript.transcript.length - 1) {
  //         ++this.indexOfCurrentTranscript;
  //       }
  //       break;
  
  //     case 'repeat':
  //       break;
  
  //     default:
  //       return;
  //   }
  
  //   this.updateCaption(false);
  //   this.youtubeService.seekVideoTo(this.highlightedTranscript?.start);
  // }
}
