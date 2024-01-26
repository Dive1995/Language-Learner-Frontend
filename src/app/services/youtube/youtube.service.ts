import { Injectable } from '@angular/core';
import { YouTubePlayer } from '@angular/youtube-player';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  private youtubePlayer: YouTubePlayer | null = null;

  constructor() { }

  setYoutubePlayer(player: YouTubePlayer | null): void{
    this.youtubePlayer = player;
  }

  
  seekVideoTo(timestamp: number){
    const player: any = this.youtubePlayer;
    player.seekTo(timestamp, true);
    player.playVideo();
  }
}
