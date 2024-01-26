import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranscriptService {
  _baseUrl: string = 'http://127.0.0.1:5000/video';

  constructor(private http: HttpClient) { }

  getTranscript(video_id: string): Observable<any>{
    return this.http.post<any>(this._baseUrl,{
      "video_id": video_id,
      "lang":"de-DE" //TODO: make language as input array
    })
  }
}
