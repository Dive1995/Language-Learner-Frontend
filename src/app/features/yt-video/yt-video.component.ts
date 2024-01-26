import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { TranscriptService } from '../../services/transcript/transcript.service';
import { HttpClient } from '@angular/common/http';
import { YouTubePlayer } from '@angular/youtube-player';
import { YoutubeService } from '../../services/youtube/youtube.service';

@Component({
  selector: 'yt-video',
  templateUrl: './yt-video.component.html',
  styleUrl: './yt-video.component.scss'
})
export class YtVideoComponent implements OnInit{
  @ViewChild('youtubePlayerContainer', { static: true }) youtubePlayerContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('youtubePlayer', { static: true }) youtubePlayer: YouTubePlayer | null= null;
  videoWidth: number | undefined;
  videoHeight: number | undefined;

  isPlaying: boolean = false;


  constructor(private http: HttpClient, private youtubeService: YoutubeService, private changeDetectorRef: ChangeDetectorRef){}

  ngOnInit(): void {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }

  ngAfterViewInit(): void {
    this.youtubeService.setYoutubePlayer(this.youtubePlayer);
    this.onResize();
    window.addEventListener('resize', this.onResize);
  }

  //FIXME: doesn't work properly 
  onResize = (): void => {
    this.videoWidth = this.youtubePlayerContainer ? Math.min(this.youtubePlayerContainer.nativeElement.clientWidth, 1100) : 0;
    this.videoHeight = this.videoWidth * 0.6;
    console.log(`resizing: width:${this.videoWidth} height:${this.videoHeight}`);
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
  }

  onPlayerStateChange(event:any){
    this.isPlaying = event.data == 1 ? true : false;
    // //TODO: create a seperate fn for updating the transcript while playing (need to check if we can, maybe we can;t bcz of the timer)
    // if(event?.data === YT.PlayerState.PLAYING){
    //   this.highlightTranscriptInterval = setInterval(() => {
    //     this.currentPlayTime = this.youtubePlayer?.getCurrentTime() ?? 0;
    //     this.updateCaption()
    //   },500)
    // }else{
    //   clearInterval(this.highlightTranscriptInterval);
    // }
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
