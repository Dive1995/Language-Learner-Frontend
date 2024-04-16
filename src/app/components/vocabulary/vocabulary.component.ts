import { Component, OnInit } from '@angular/core';
import { VocabularyService } from '../../services/vocabulary/vocabulary.service';
import { ActivatedRoute } from '@angular/router';
import User from '../../Models/User';
import { AuthService } from '../../services/auth/auth.service';
import { Results, WordMeaning } from '../../Models/WordMeaning';

@Component({
  selector: 'app-vocabulary',
  templateUrl: './vocabulary.component.html',
  styleUrl: './vocabulary.component.scss'
})
export class VocabularyComponent implements OnInit{
  user: User | null = null;
  videoId: string = "";
  expandedWord: WordMeaning | null = null;
  selectedContext: Results | null = null;
  vocabularyList$ = this.vocabularyService.vocabularyList$;


  constructor(private authService: AuthService,private vocabularyService: VocabularyService, private route: ActivatedRoute){}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.videoId = this.route.snapshot.paramMap.get('id') || "";
  }

  expandMeaning(vocabulary: WordMeaning){
    this.expandedWord = vocabulary;
  }

  selectContext(context: Results){
    this.selectedContext = context;
  }
}
