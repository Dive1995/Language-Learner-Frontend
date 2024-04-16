import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { YoutubeService } from '../../services/youtube/youtube.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrl: './learn.component.scss'
})
export class LearnComponent {
  isPlaying: boolean = false;  
  
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
