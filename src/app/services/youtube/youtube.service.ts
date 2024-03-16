import { Injectable } from '@angular/core';
import { YouTubePlayer } from '@angular/youtube-player';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

// reasons for yt-service: 
// 1. to control from the main page (keyboard events)
// 2. match transcript with video play time
// 3. get & set video_id
export class YoutubeService {
  private youtubePlayer: YouTubePlayer | null = null;
  
  // current state of the video player - playing or paused/stopped
  private videoPlayingSubject = new BehaviorSubject<boolean>(false);
  isPlaying$ = this.videoPlayingSubject.asObservable();

  // current video_id of the playing video
  private videoIdSubject = new BehaviorSubject<string>('');
  video_id$ = this.videoIdSubject.asObservable();

  setVideoId(id: string){
    this.videoIdSubject.next(id);
  }

  setPlaying(value: boolean){
    this.videoPlayingSubject.next(value)
  }


  private currentPlayTimeSubject = new Subject<number>();
  currentPlayTime$ = this.currentPlayTimeSubject.asObservable();

  setCurrentPlayTime(time: number){
    this.currentPlayTimeSubject.next(time);
  }

  setYoutubePlayer(player: YouTubePlayer | null): void{
    this.youtubePlayer = player;
  }

  playVideo(){
    this.youtubePlayer?.playVideo();
  }

  pauseVideo(){
    console.log("pause video")
    this.youtubePlayer?.pauseVideo();
  }

  setPlayerState(value: boolean){
    this.videoPlayingSubject.next(value)
  }

  playHandler(){
    // if the player is playing pause it
    // if paused pllay it
    const player: any = this.youtubePlayer;
    console.log("play handler")
    // if(this.isPlaying$.subscribe()) {
    //   player.pauseVideo();
    // }else{
    //   player.playVideo();  
    // }
  }
  
  seekVideoTo(timestamp: number){
    console.log("Seek video: ", timestamp);
    const player: any = this.youtubePlayer;
    player.seekTo(timestamp, true);
    player.playVideo();
  }
}
