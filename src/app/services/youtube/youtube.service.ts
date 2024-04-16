import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { YouTubePlayer } from '@angular/youtube-player';
import { BehaviorSubject, Observable, Subject, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class YoutubeService {

  constructor(private http: HttpClient){}

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
    this.isPlaying$.pipe(take(1)).subscribe(value =>  {
      if(value) {
        this.youtubePlayer?.pauseVideo();
      }else{
        this.youtubePlayer?.playVideo();  
      }
    })
  }
  
  seekVideoTo(timestamp: number){
    console.log("Seek video: ", timestamp);
    const player: any = this.youtubePlayer;
    player.seekTo(timestamp, true);
    player.playVideo();
  }

  // calling YouTubee Data V3 api
  //TODO: move api-key to environment variable
  getVideoListFromYouTube(search: string): Observable<any>{
    const validatedSearch = search.split(' ').join("%20");
    console.log("validatedSearch ",validatedSearch);
    return this.http.get(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyCaZskiR9b7_dWDDg4-3V6xa8NCy4OdW4o&q=${validatedSearch}&type=video&part=snippet&relevanceLanguage=de&maxResults=50&videoEmbeddable=true`)
  }
}
