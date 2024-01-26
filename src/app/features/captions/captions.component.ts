import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranscriptService } from '../../services/transcript/transcript.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-captions',
  templateUrl: './captions.component.html',
  styleUrl: './captions.component.scss'
})
export class CaptionsComponent implements OnInit{
  //FIXME: create a transcrip model
  transcript?: {transcript: [{text:string,start:number, duration:number}], is_generated: boolean};

  constructor(private http: HttpClient, private transcriptService: TranscriptService, private changeDetectorRef: ChangeDetectorRef){}

  ngOnInit(): void {
    this.transcriptService.getTranscript('4-eDoThe6qo').subscribe(result => {
      this.transcript = result;
    })      
  }

}
