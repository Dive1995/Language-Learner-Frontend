import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, fromEvent, map, startWith, take, tap } from 'rxjs';
import { YoutubeService } from '../youtube/youtube.service';
import { combineLatest } from 'rxjs'
import Transcript  from '../../Models/transcript'
import Caption  from '../../Models/Caption'

@Injectable({
  providedIn: 'root'
})
export class TranscriptService {
  _baseUrl: string = 'http://127.0.0.1:5000/video';  

  transcript?: Transcript;
  highlightedTranscript: any = null;

  keyDowns$ = fromEvent<KeyboardEvent>(document, 'keydown');


  constructor(private http: HttpClient, private youtubeService: YoutubeService) { }

  //FIXME: create a model and replace the type
  transcript$ = this.http.post<Transcript>(this._baseUrl,{
      "video_id": 'zDxlhYwSU-0', //this.youtubeService.video_id$,
      "lang": {
        "first": ["de", "de-DE"],
        "second": ["en"]
      } 
    })

  timedCaption$ = combineLatest(
    this.youtubeService.currentPlayTime$,
    this.transcript$, 
  ).pipe(
    map(([playTime, transcript]) => {
      let currentCaptionIndex = -1;

      for (let i = 0; i < transcript.firstTranscript.length; i++) {
        if (playTime >= transcript.firstTranscript[i].start) {
            currentCaptionIndex = i;
        } else {
            break;
        }
      }

      return {
        firstTranscript: transcript.firstTranscript[currentCaptionIndex],
        secondTranscript: transcript.secondTranscript[currentCaptionIndex],
        firstCaption: transcript.firstTranscript[currentCaptionIndex]?.text.split(' '),
        secondCaption: transcript.secondTranscript[currentCaptionIndex]?.text.split(' '),
        index: currentCaptionIndex,
        isGenerated: transcript.first_is_generated
      }
    }),
    // tap((value) => console.log(value.firstTranscript))
  )

  // timedCaptionWithEvents$ = combineLatest(
  //   this.keyDowns$,
  //   this.transcript$,
  //   this.youtubeService.currentPlayTime$,
  // ).pipe(
  //   map(([event, transcript, playTime]) => {
  //     let currentCaptionIndex = transcript.firstTranscript.findIndex((caption:Caption) => caption.start <= playTime && playTime <= (caption.start + caption.duration)) || -1;

  //     switch (event.key) {
  //       case 'ArrowLeft':
  //         currentCaptionIndex -= 1;
  //         console.log("yt left");
  //         this.youtubeService.seekVideoTo(transcript.firstTranscript[currentCaptionIndex]?.start)
  //         break;
  //       case 'ArrowRight':
  //         currentCaptionIndex += 1;
  //         this.youtubeService.seekVideoTo(transcript.firstTranscript[currentCaptionIndex]?.start)
  //         console.log("yt right");
  //         break;
  //       case ' ':
  //         console.log("yt space");
  //         this.youtubeService.playHandler()
  //         break;
  //       default:
  //         break;
  //     }
  //     return {
  //       firstTranscript: transcript.firstTranscript,
  //       secondTranscript: transcript.secondTranscript,
  //       firstCaption: transcript.firstTranscript[currentCaptionIndex]?.text.split(' '),
  //       secondCaption: transcript.secondTranscript[currentCaptionIndex]?.text.split(' '),
  //       index: currentCaptionIndex
  //     }
  //   })
  // )


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
