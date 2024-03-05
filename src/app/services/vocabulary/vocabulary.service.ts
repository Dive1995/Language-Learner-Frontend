import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, combineLatest, map, mergeMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VocabularyService {
  private baseUrl: string = 'http://127.0.0.1:5000/vocabulary/translation';

  private findMeaningSubject = new Subject();
  findMeaning$ = this.findMeaningSubject.asObservable();

  setSearchingWord(word: string){
    this.findMeaningSubject.next(word)
  }  

  wordMeaning$ = this.findMeaning$.pipe(
    mergeMap((word) => this.http.post<any>('http://127.0.0.1:5000/vocabulary/context',{"word":word})),
    tap((meaning) => console.log("meaning: ", meaning))
  )

  // getWordMeaning(word: string): Observable<any>{
  //   return this.http.post<any>('http://127.0.0.1:5000/vocabulary/context',{"word":word})
  // }

  constructor(private http: HttpClient) { }
}
