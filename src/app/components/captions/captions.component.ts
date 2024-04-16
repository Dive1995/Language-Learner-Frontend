import { Component, OnInit } from '@angular/core';
import { TranscriptService } from '../../services/transcript/transcript.service';
import { VocabularyService } from '../../services/vocabulary/vocabulary.service';
import { YoutubeService } from '../../services/youtube/youtube.service';
import { fromEvent, tap } from 'rxjs';
import { WordMeaning } from '../../Models/WordMeaning';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import User from '../../Models/User';

@Component({
  selector: 'app-captions',
  templateUrl: './captions.component.html',
  styleUrl: './captions.component.scss',
})
export class CaptionsComponent implements OnInit{
  clickedWord?: string;
  clickedWordIndex?: number;
  showWordAdd: boolean = false;
  showInfo: boolean = true;
  showLogin: boolean = false;
  user: User | null = null;

  transcript$ = this.transcriptService.timedCaptionWithEvents$.pipe(
    tap(value => {
      if(value.control.pauseAfterCaption && value.firstTranscript){
        setTimeout(() => {
          this.youtubeService.pauseVideo();
        }, value.firstTranscript?.duration * 1000)
      }
    })
  )
  controls$ = this.transcriptService.controls$

  wordMeaning$ = this.vocabularyService.wordMeaning$;

  pageClickSubscription = fromEvent(document.getElementsByClassName('caption__text-word'), 'click').subscribe();

  constructor(
    private transcriptService: TranscriptService, 
    private youtubeService: YoutubeService, 
    private vocabularyService: VocabularyService,
    private authService: AuthService,
    private route: ActivatedRoute
  ){}

  ngOnInit(): void {
    setTimeout(() => {
      this.showInfo = false;
    }, 10000);

    this.user = this.authService.getUser();
  }

  toggleInfo(){
    this.showInfo = !this.showInfo;
  }

  findWordMeaning(value: string, index: number){
   this.clickedWord = value;
   this.clickedWordIndex = -1;
   this.youtubeService.pauseVideo();
   this.vocabularyService.setSearchingWord(value)
   this.clickedWordIndex = index;
   this.shouldShowAddOption(value);
  }

  closeWordMeaning(){
    this.clickedWord = '';
    this.clickedWordIndex = -1;
    this.youtubeService.playHandler()
    this.showLogin = false;
  }

  shouldShowAddOption(word: string){
    const vocabularyList = localStorage.getItem("vocabularyList")
    if(vocabularyList){
      const vocabulary = JSON.parse(vocabularyList);
      this.showWordAdd = vocabulary.filter((item: any) => item.input === word).length > 0 ? false : true;
    }else{
      this.showWordAdd = true;
    }
  }

  addWord(meaning: WordMeaning){
    if(this.user){
      const videoId = this.route.snapshot.paramMap.get('id') || '';
      this.vocabularyService.addWordToVocabulary(meaning, videoId);
    }else{
      this.showLogin = true;
    }
  }

  closeLogin(){
    this.showLogin = false;
  }
}
