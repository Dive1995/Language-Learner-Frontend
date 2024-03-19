import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranscriptService } from '../../services/transcript/transcript.service';
import { VocabularyService } from '../../services/vocabulary/vocabulary.service';
import { YoutubeService } from '../../services/youtube/youtube.service';
import { fromEvent, tap } from 'rxjs';

@Component({
  selector: 'app-captions',
  templateUrl: './captions.component.html',
  styleUrl: './captions.component.scss',
})
export class CaptionsComponent implements OnInit{
  clickedWord?: string;
  clickedWordIndex?: number;

  transcript$ = this.transcriptService.timedCaptionWithEvents$.pipe(
    tap(value => {
      console.log(value)
      if(value.control.pauseAfterCaption && value.firstTranscript){
        setTimeout(() => {
          this.youtubeService.pauseVideo();
        }, value.firstTranscript?.duration * 1000)
      }
    })
  )
  controls$ = this.transcriptService.controls$.pipe(tap(value => console.log(value)))

  wordMeaning$ = this.vocabularyService.wordMeaning$;

  pageClickSubscription = fromEvent(document.getElementsByClassName('caption__text-word'), 'click').subscribe(() => console.log("adsf"));

  constructor(
    private transcriptService: TranscriptService, 
    private youtubeService: YoutubeService, 
    private vocabularyService: VocabularyService){}

  ngOnInit(): void {
    
  }

  findWordMeaning(value: string, index: number){
   console.log(value); 
   this.clickedWord = value;
   this.clickedWordIndex = -1;
   this.vocabularyService.setSearchingWord(value)
   this.youtubeService.pauseVideo();
   this.clickedWordIndex = index;
   console.log("clickedWord: ", this.clickedWord); 
   console.log("clickedWordIndex: ", this.clickedWordIndex); 
  //  this.vocabularyService.getWordMeaning(value).subscribe(value => console.log("result: ", value)); 
  }
}
