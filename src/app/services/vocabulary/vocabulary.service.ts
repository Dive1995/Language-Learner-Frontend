import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, combineLatest, distinctUntilChanged, filter, map, merge, mergeMap, of, scan, shareReplay, startWith, switchMap, tap } from 'rxjs';
import { WordMeaning } from '../../Models/WordMeaning';
import { AuthService } from '../auth/auth.service';
import { YoutubeService } from '../youtube/youtube.service';
import VideoHistory from '../../Models/VideoHistory';
import User from '../../Models/User';

@Injectable({
  providedIn: 'root'
})
export class VocabularyService {
  private baseUrl: string = 'http://127.0.0.1:5000';

  something = this.youtubeService.video_id$.pipe()

  vocabularyLocalList = this.authService.getUser()?.videoHistory || [];
  // vocabularyInitialState = this.vocabularyLocalList ? JSON.parse(this.vocabularyLocalList) : []
  
  vocabularyListSubject = new BehaviorSubject<VideoHistory[]>(this.vocabularyLocalList);
  vocabularyList$ = this.vocabularyListSubject.asObservable();


  constructor(private http: HttpClient, private youtubeService: YoutubeService, private authService: AuthService) {}

  addWordToVocabulary(vocabulary: WordMeaning, videoId: string){
    console.log("add meaning: ", vocabulary);

    const user = this.authService.getUser();

    if(user){
      console.log("user : ", user)
      const vocabularyList = user.videoHistory.find(history => history.video_id === videoId)?.vocabList || [];
      
      this.updateVocabularyListInDB(user.id, videoId, vocabulary).subscribe((updatedUser) => {
        this.authService.setUser(updatedUser)

        const updatedVocabularyList = updatedUser.videoHistory;

        this.vocabularyListSubject.next(updatedVocabularyList);
      },
      (err) => {
        console.log("Error occured while trying to save new word: ",err)
      })
    }
  }

  updateVocabularyListInDB(userId: string, videoId: string, meaning: WordMeaning): Observable<User>{
    return this.http.post<User>(`${this.baseUrl}/user/vocabulary`, {id: userId, videoId: videoId, vocabulary: meaning})
  }

  private findMeaningSubject = new Subject<string>();
  findMeaning$ = this.findMeaningSubject.asObservable();

  setSearchingWord(word: string){
    console.log("set search: ", word)
    this.findMeaningSubject.next(word)
  }  

  wordMeaning$ = this.findMeaning$.pipe(
    // mergeMap((word) => this.http.post<any>('http://127.0.0.1:5000/vocabulary/context',{"word":word})),
    distinctUntilChanged((prev, curr) => prev === curr),
    switchMap((word) => {

      //  check if the word is already on any list
      const user = this.authService.getUser();
      if(user){
        var filteredVocab: WordMeaning | null = null
        user.videoHistory.forEach((history) => {
          const result = history.vocabList.find((vocab: WordMeaning) => vocab.input === word)
          if(result)
            filteredVocab = result;
        })
        if(filteredVocab) return of(filteredVocab);
      }
      // if it is show the meaning
      // if not search meaning

      console.log('api call')
      return this.http.post<any>(`${this.baseUrl}/vocabulary/translation`,{"input":word, "to":"en", "from":"de"})
      .pipe(map((response) => {
        console.log(response)
        let contextResultsList = response?.contextResults.results.slice(0,5).map((context:any) => {
          context.sourceExamples = context.sourceExamples.slice(0,5);
          context.targetExamples = context.targetExamples.slice(0,5);
          return context
        });
        return {contextResults: contextResultsList, input: response.input[0], translation: response.translation[0]};
      }))
    }),
    tap((meaning) => console.log("meaning: ", meaning)),
    shareReplay(1),
  )

  // getWordMeaning(word: string): Observable<any>{
  //   return this.http.post<any>('http://127.0.0.1:5000/vocabulary/context',{"word":word})
  // }
}
