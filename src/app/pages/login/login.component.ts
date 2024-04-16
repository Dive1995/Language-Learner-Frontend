declare var google: any;
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit{
  constructor(private router: Router, private authService: AuthService){}

  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id: environment.GOOGLE_CLIENT_ID,
      callback: (resp: any) => this.handleLogin(resp)
    })

    google.accounts.id.renderButton(document.getElementById('google-btn'), {
      theme: 'filled_blue',
      size: 'large',
      shape: 'rectangle',
      width: 350
    })
  }

  handleLogin(response: any){
    if(response){
      const user = this.authService.logIn(response);

      this.authService.getOrAddUser(user).subscribe(response => {
        console.log(response)
        this.authService.setUser(response);
        this.router.navigate(['learn']);
      }, 
      (err) => console.log("Sign in error: ", err))
    }
  }

  signOut(){
    google.accounts.iddisableAutoSelect();
    this.authService.logOut();
    location.reload();
    this.router.navigate(['/learn']);
  }
}