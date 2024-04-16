import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { YouTubePlayer } from '@angular/youtube-player';
import { BehaviorSubject, Observable, Subject, take } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class YoutubeService {

  constructor(private http: HttpClient){}

  private youtubePlayer: YouTubePlayer | null = null;
  
  private videoPlayingSubject = new BehaviorSubject<boolean>(false);
  isPlaying$ = this.videoPlayingSubject.asObservable();

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
    const player: any = this.youtubePlayer;
    player.seekTo(timestamp, true);
    player.playVideo();
  }

  getVideoListFromYouTube(search: string): Observable<any>{
    const validatedSearch = search.split(' ').join("%20");
    return this.http.get(`https://www.googleapis.com/youtube/v3/search?key=${environment.GOOGLE_API_KEY}&q=${validatedSearch}&type=video&part=snippet&relevanceLanguage=de&maxResults=50&videoEmbeddable=true`)
  }
}
