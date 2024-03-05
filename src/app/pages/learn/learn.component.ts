import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { TranscriptService } from '../../services/transcript/transcript.service';
import { YoutubeService } from '../../services/youtube/youtube.service';
import { VocabularyService } from '../../services/vocabulary/vocabulary.service';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrl: './learn.component.scss'
})
export class LearnComponent {
  isPlaying: boolean = false;  
  
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

  wordMeaning$ = this.vocabularyService.wordMeaning$;


  constructor(
    private http: HttpClient, 
    private transcriptService: TranscriptService, 
    private vocabularyService: VocabularyService, 
    private changeDetectorRef: ChangeDetectorRef,
    private youtubeService: YoutubeService){}


  ngOnInit() {
  }  


  //TODO: move to vocabulary service
  getWordTranslation(word: string){
    word = word.replace(/[^a-zA-Z0-9]/g, '');
    this.http.post<any>('http://127.0.0.1:5000/vocabulary/context',{
      "word":word
    }).subscribe(result => {
      this.context = result;
    })      
  }



@HostListener('window:keydown', ['$event'])
handleKeyboardEvents(event: KeyboardEvent){

  if(event.metaKey || event.ctrlKey){
    return;  
  }

  this.youtubeService.setKeyboardEvent(event);
}
}
