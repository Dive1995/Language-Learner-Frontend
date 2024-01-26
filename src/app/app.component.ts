import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import {YouTubePlayer} from '@angular/youtube-player';
import { TranscriptService } from './services/transcript/transcript.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  @ViewChild('youtubePlayer', { static: true }) youtubePlayer?: YouTubePlayer;
  // @ViewChild('youtubePlayerContainer', { static: true }) youtubePlayerContainer?: ElementRef<HTMLDivElement>;
  // videoWidth: number | undefined;
  // videoHeight: number | undefined;
  isPlaying: boolean = false;

  currentPlayTime:number = 0;
  highlightedTranscript: any = null;
  highlightTranscriptInterval: any;
  indexOfCurrentTranscript: number = -1;
  
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

  //TODO: move this to transcript
  transcript?: {transcript: [{text:string,start:number, duration:number}], is_generated: boolean};

  constructor(private http: HttpClient, private transcriptService: TranscriptService, private changeDetectorRef: ChangeDetectorRef){}


  ngOnInit() {
    // const tag = document.createElement('script');
    // tag.src = 'https://www.youtube.com/iframe_api';
    // document.body.appendChild(tag);

    //TODO: move this to transcript
    this.transcriptService.getTranscript('4-eDoThe6qo').subscribe(result => {
      this.transcript = result;
    })      
  }  

  // ngAfterViewInit(): void {
  //   this.onResize();
  //   window.addEventListener('resize', this.onResize);
  // }

  // onResize = (): void => {
  //   // Automatically expand the video to fit the page up to 1200px x 720px
  //   this.videoWidth = this.youtubePlayerContainer ? Math.min(this.youtubePlayerContainer.nativeElement.clientWidth, 1100) : 0;
  //   this.videoHeight = this.videoWidth * 0.6;
  //   this.changeDetectorRef.detectChanges();
  // }

  // ngOnDestroy(): void {
  //   window.removeEventListener('resize', this.onResize);
  // }



  // onPlayerStateChange(event:any){
  //   this.isPlaying = event.data == 1 ? true : false;
  //   if(event?.data === YT.PlayerState.PLAYING){
  //     this.highlightTranscriptInterval = setInterval(() => {
  //       this.currentPlayTime = this.youtubePlayer?.getCurrentTime() ?? 0;
  //       this.updateCaption()
  //     },500)
  //   }else{
  //     clearInterval(this.highlightTranscriptInterval);
  //   }
  // }

  //TODO: move to vocabulary service
  getWordTranslation(word: string){
    word = word.replace(/[^a-zA-Z0-9]/g, '');
    this.http.post<any>('http://127.0.0.1:5000/vocabulary/context',{
      "word":word
    }).subscribe(result => {
      this.context = result;
    })      
  }

  updateCaption(automatic: boolean = true){
    if(automatic){
      this.indexOfCurrentTranscript = this.transcript?.transcript.findIndex(caption => caption.start <= this.currentPlayTime && this.currentPlayTime <= (caption.start + caption.duration)) || -1;
    }

    this.highlightedTranscript = this.indexOfCurrentTranscript >= 0 ? this.transcript?.transcript[this.indexOfCurrentTranscript] : null;
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

playHandler(){
  const player: any = this.youtubePlayer;

  if(this.isPlaying) {
    player.pauseVideo();
  }else{
    player.playVideo();  
  }
}

seekVideoTo(timestamp: number){
  const player: any = this.youtubePlayer;
  player.seekTo(timestamp, true);
  player.playVideo();
}

switchTranscriptTo(track: string): void {
  if (!this.transcript) {
    return;
  }

  switch (track) {
    case 'prev':
      if (this.indexOfCurrentTranscript > 0) {
        --this.indexOfCurrentTranscript;
      }
      break;

    case 'next':
      if (this.indexOfCurrentTranscript < this.transcript.transcript.length - 1) {
        ++this.indexOfCurrentTranscript;
      }
      break;

    case 'repeat':
      break;

    default:
      return;
  }

  this.updateCaption(false);
  this.seekVideoTo(this.highlightedTranscript?.start);
}

// @HostListener('window:keydown', ['$event'])
// handleKeyboardEvents(event: KeyboardEvent){

//   switch (event.key) {
//     case 'ArrowLeft':
//       this.switchTranscriptTo("prev")
//       break;
//     case 'ArrowRight':
//       this.switchTranscriptTo("next")
//       break;
//       case ' ':
//         // Handle space key
//         this.playHandler()
//       break;
//     case 'r':
//     case 'R':
//       // Handle 'R' key
//       this.switchTranscriptTo("repeat")
//       break;
//     default:
//       break;
//   }
// }

}
