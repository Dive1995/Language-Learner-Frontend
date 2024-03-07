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
  videoId: string = 'zDxlhYwSU-0';

  highlightTranscriptInterval: any;

  // isPlaying: boolean = false;


  constructor(private http: HttpClient, private youtubeService: YoutubeService, private changeDetectorRef: ChangeDetectorRef){}

  ngOnInit(): void {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }

  // onYouTubeIframeAPIReady() {
  //   this.youtubePlayer = new YT.Player('player', {
  //     height: '390',
  //     width: '640',
  //     videoId: 'M7lc1UVf-VE',
  //     playerVars: {
  //       'controls': 0
  //     }
  //   });
  // }

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

  // @HostListener('window:keydown', ['$event'])
  handleKeyboardEvents(event: any){
    
  }

  onPlayerStateChange(event:any){
    this.youtubeService.setPlayerState(event.data == 1 ? true : false);
    //TODO:create a seperate fn for updating the transcript while playing (need to check if we can, maybe we can;t bcz of the timer)
    if(event?.data === YT.PlayerState.PLAYING){
      this.highlightTranscriptInterval = setInterval(() => {
        var currentPlayTime = this.youtubePlayer?.getCurrentTime() ?? 0;
        this.youtubeService.setCurrentPlayTime(currentPlayTime)
        // this.updateCaption()
      },500)
    }else{
      clearInterval(this.highlightTranscriptInterval);
    }
  }



}
