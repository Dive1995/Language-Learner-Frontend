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
  highlightedTranscript: any = null;

  caption$ = this.transcriptService.timedCaption$;

  constructor(private http: HttpClient, private transcriptService: TranscriptService, private changeDetectorRef: ChangeDetectorRef){}

  ngOnInit(): void {
    
  }

  breakSentence(sentence: string){
    return sentence.split(' ');
  }
}
