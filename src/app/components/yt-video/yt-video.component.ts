import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('youtubePlayer') youtubePlayer!: YouTubePlayer;
  videoWidth: number | undefined;
  videoHeight: number | undefined;

  videoId$ = this.youtubeService.video_id$;

  highlightTranscriptInterval: any;


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

  onResize = (): void => {
    this.videoWidth = this.youtubePlayerContainer ? Math.min(this.youtubePlayerContainer.nativeElement.clientWidth, 1100) : 0;
    this.videoHeight = this.videoWidth * 0.6;
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
  }

  onPlayerStateChange(event:any){
    this.youtubeService.setPlayerState(event.data == 1 ? true : false);
    if(event?.data === YT.PlayerState.PLAYING){
      this.highlightTranscriptInterval = setInterval(() => {
        var currentPlayTime = this.youtubePlayer?.getCurrentTime() ?? 0;
        this.youtubeService.setCurrentPlayTime(currentPlayTime)
      },100)
    }else{
      clearInterval(this.highlightTranscriptInterval);
    }
  }
}
