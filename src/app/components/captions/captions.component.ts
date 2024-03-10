import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranscriptService } from '../../services/transcript/transcript.service';
import { VocabularyService } from '../../services/vocabulary/vocabulary.service';
import { YoutubeService } from '../../services/youtube/youtube.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-captions',
  templateUrl: './captions.component.html',
  styleUrl: './captions.component.scss',
})
export class CaptionsComponent implements OnInit{
  //FIXME: create a transcrip model
  transcript?: {transcript: [{text:string,start:number, duration:number}], is_generated: boolean};
  highlightedTranscript: any = null;

  transcript$ = this.transcriptService.timedCaption$

  constructor(
    private transcriptService: TranscriptService, 
    private youtubeService: YoutubeService, 
    private vocabularyService: VocabularyService){}

  ngOnInit(): void {
    
  }

  findWordMeaning(value: string){
   console.log(value); 
   this.vocabularyService.setSearchingWord(value)
  //  this.vocabularyService.getWordMeaning(value).subscribe(value => console.log("result: ", value)); 
  }
}
