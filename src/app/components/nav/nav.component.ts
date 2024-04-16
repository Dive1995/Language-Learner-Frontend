import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Observable, tap } from 'rxjs';
import User from '../../Models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent implements OnInit{
  user: User | null = null;

  constructor(private authService: AuthService, private router: Router){}

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  logOut(){
    this.authService.logOut();
    location.reload();
    this.router.navigate(['/learn']);
  }
  
}
