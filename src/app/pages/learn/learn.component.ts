import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { TranscriptService } from '../../services/transcript/transcript.service';
import { YoutubeService } from '../../services/youtube/youtube.service';
import { VocabularyService } from '../../services/vocabulary/vocabulary.service';
import { ActivatedRoute, Router } from '@angular/router';

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


  constructor(
    private youtubeService: YoutubeService, private route: ActivatedRoute, private router: Router){}


  ngOnInit() {
    const videoId = this.route.snapshot.paramMap.get('id')
    if(videoId)
      this.youtubeService.setVideoId(videoId )
    else
      this.router.navigate(["/learn"])
  }  
}
