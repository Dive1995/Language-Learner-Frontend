import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { YoutubeService } from '../../services/youtube/youtube.service';
import { Router } from '@angular/router';
import User from '../../Models/User';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  user: User | null = null;
  otherVideoList: any;
  searchText: string = "";
  searchError: string = "";

  constructor(private authService: AuthService, private youtubeService: YoutubeService, private router: Router){}

  ngOnInit(){
    this.user = this.authService.getUser();

    const otherVideosString = localStorage.getItem("otherVideos");
    if(otherVideosString){
      this.otherVideoList = JSON.parse(otherVideosString)
    }else{
      this.getVideos("Easy German")
    }
  }

  getVideos(searchText: string){
    this.youtubeService.getVideoListFromYouTube(searchText).subscribe(response => {
      this.otherVideoList = response.items;
      const otherVideosString = JSON.stringify(response.items);
      localStorage.setItem("otherVideos", otherVideosString)
    }, 
    (error) => console.log("Error occured when trying to fetch videos, ", error))
  }

  searchVideo(){
    this.searchError = "";
    if(this.searchText){
      if(this.searchText.includes("http://") || this.searchText.includes("https://")){
        const videoId = this.searchText.split("v=")[1];
        if(videoId && this.isValidYouTubeVideoId(videoId)){
          this.router.navigate(['/learn', videoId])
        }else{
            this.searchError = "Invalid link"
        }
      }else{
        this.getVideos(this.searchText);
      }
    }
  }

  isValidYouTubeVideoId(videoId: string): boolean {
    return videoId.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(videoId);
  }

}
