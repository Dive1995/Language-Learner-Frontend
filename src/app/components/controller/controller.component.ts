import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TranscriptService } from '../../services/transcript/transcript.service';
import { Subscription, combineLatest, startWith, take, tap } from 'rxjs';

@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrl: './controller.component.scss'
})
export class ControllerComponent implements OnInit, OnDestroy{

  showSecondCaption = new FormControl(false)
  unblurSecondCaption= new FormControl(false)
  pauseAfterCaption= new FormControl(false)

  controlSubscription?: Subscription;
  
  constructor(private fb: FormBuilder, private transcriptService: TranscriptService){}
 
  ngOnInit(): void {
    this.controlSubscription = combineLatest(
      this.showSecondCaption.valueChanges.pipe(startWith(false)),
      this.unblurSecondCaption.valueChanges.pipe(startWith(false)),
      this.pauseAfterCaption.valueChanges.pipe(startWith(false))
    ).subscribe(([show, unblur, pause]) => this.transcriptService.setControls({
      showSecondCaption: show ? true : false, 
      unblurSecondCaption: unblur ? true : false,
      pauseAfterCaption: pause ? true : false,
    }))
  }

  ngOnDestroy(): void {
    this.controlSubscription?.unsubscribe();
  }
}
