import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, combineLatest, distinctUntilChanged, map, mergeMap, shareReplay, switchMap, tap } from 'rxjs';
import { WordMeaning } from '../../Models/WordMeaning';

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
    // mergeMap((word) => this.http.post<any>('http://127.0.0.1:5000/vocabulary/context',{"word":word})),
    distinctUntilChanged((prev, curr) => prev === curr),
    switchMap((word) => {
      console.log('api call')
      return this.http.post<WordMeaning>('http://127.0.0.1:5000/vocabulary/translation',{"input":word, "to":"en", "from":"de"})
      .pipe(map(response => {
        return {contextResults: response.contextResults, input: response.input[0], translation: response.translation[0]};
      }))
    }),
    tap((meaning) => console.log("meaning: ", meaning)),
    shareReplay(1),
  )

  // getWordMeaning(word: string): Observable<any>{
  //   return this.http.post<any>('http://127.0.0.1:5000/vocabulary/context',{"word":word})
  // }

  constructor(private http: HttpClient) { }
}
