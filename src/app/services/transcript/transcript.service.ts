import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, fromEvent, map, startWith, switchMap, tap } from 'rxjs';
import { YoutubeService } from '../youtube/youtube.service';
import { combineLatest } from 'rxjs'
import Transcript  from '../../Models/transcript'
import { Controls } from '../../Models/controls';

@Injectable({
  providedIn: 'root'
})
export class TranscriptService {
  _baseUrl: string = 'http://127.0.0.1:5000/video';  

  transcript?: Transcript;
  highlightedTranscript: any = null;

  keyDowns$ = fromEvent<KeyboardEvent>(document, 'keydown');
  isKeyHandled = true;


  constructor(private http: HttpClient, private youtubeService: YoutubeService) { }

  controlsSubject = new BehaviorSubject<Controls>({showSecondCaption: false, unblurSecondCaption: false, pauseAfterCaption: false});
  controls$ = this.controlsSubject.asObservable();

  setControls(value:Controls): void{
    this.controlsSubject.next(value)
  }

  transcript$ = this.youtubeService.video_id$.pipe(
    switchMap(videoId => {
        return this.http.post<Transcript>(this._baseUrl, {
          "video_id": videoId,
          "lang": {
            "first": ["de", "de-DE"],
            "second": ["en"]
          }
        });
      })
    );

  timedCaption$ = combineLatest(
    this.youtubeService.currentPlayTime$,
    this.transcript$,
    this.controls$ 
  ).pipe(
    map(([playTime, transcript, control]) => {
      let firstCaptionIndex = -1;
      let secondCaptionIndex = -1;
      playTime = Math.round(playTime * 1000)/1000;
      
      for (let i = 0; i < transcript.firstTranscript.length; i++) {
        if (playTime >= transcript.firstTranscript[i].start && playTime <= (transcript.firstTranscript[i].start + transcript.firstTranscript[i].duration)) {
            firstCaptionIndex = i;
          } 
        }

      for (let i = 0; i < transcript.secondTranscript.length; i++) {
        if (playTime >= transcript.secondTranscript[i].start && playTime <= (transcript.secondTranscript[i].start + transcript.secondTranscript[i].duration)) {
          secondCaptionIndex = i;
        } 
      }

      return {
        firstTranscriptList: transcript.firstTranscript,
        secondTranscriptList: transcript.secondTranscript,
        firstTranscript: transcript.firstTranscript[firstCaptionIndex],
        secondTranscript: transcript.secondTranscript[secondCaptionIndex],
        firstCaption: transcript.firstTranscript[firstCaptionIndex]?.text.split(' '),
        secondCaption: transcript.secondTranscript[secondCaptionIndex]?.text.split(' '),
        firstIndex: firstCaptionIndex,
        secondIndex: secondCaptionIndex,
        isGenerated: transcript.first_is_generated,
        isSecondGenerated: transcript.second_is_generated,
        control: control
      }
    }),
    distinctUntilChanged((prev, curr) => prev.firstIndex === curr.firstIndex)
  )


  timedCaptionWithEvents$ = combineLatest(
    this.keyDowns$.pipe(
      startWith({ key: null }),
      tap(() => this.isKeyHandled = false)
      ),
    this.timedCaption$
  ).pipe(
    map(([event, transcript]) => {

      let firstIndex = transcript.firstIndex;
      let secondIndex = transcript.secondIndex;

      if(!this.isKeyHandled){
        switch (event.key) {
          case 'ArrowLeft':
            --firstIndex;
            --secondIndex;
            this.youtubeService.seekVideoTo(transcript.firstTranscriptList[firstIndex]?.start);
            this.isKeyHandled = true;
            break;
          case 'ArrowRight':
            ++firstIndex;
            ++secondIndex;
            this.youtubeService.seekVideoTo(transcript.firstTranscriptList[firstIndex]?.start)
            this.isKeyHandled = true;
            break;
          case 'R':
          case 'r':
            this.youtubeService.seekVideoTo(transcript.firstTranscriptList[firstIndex]?.start)
            this.isKeyHandled = true;
            break;
          case ' ':
            this.youtubeService.playHandler()
            this.isKeyHandled = true;
            break;
          default:
            break;
        }
      }

      return {
        ...transcript,
        firstTranscript: transcript.firstTranscriptList[firstIndex],
        secondTranscript: transcript.secondTranscriptList[secondIndex],
        firstCaption: transcript.firstTranscriptList[firstIndex]?.text.split(' '),
        secondCaption: transcript.secondTranscriptList[secondIndex]?.text.split(' '),
        firstIndex: firstIndex,
        secondIndex: secondIndex
      }
    })
  )
}
