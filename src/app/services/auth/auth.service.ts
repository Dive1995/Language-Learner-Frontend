import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import User from '../../Models/User';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = 'http://127.0.0.1:5000/user';

  private userString = localStorage.getItem('user');
  private userObject: User | null = this.userString ? this.parseUser(this.userString) : null;

  private user: User | null = this.userObject;

  getUser(){
    return this.user;
  }

  setUser(value: User | null){
    this.user = value;
    const userString = JSON.stringify(value);
    localStorage.setItem("user", userString);
  }

  constructor(private http: HttpClient) { }

  getOrAddUser(user: User): Observable<User>{
    return this.http.post<User>(this.baseUrl, user);
  }

  private parseUser(userString: string): User | null {
    try {
      return JSON.parse(userString);
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  }

  private decodeToken(token: string){
    return JSON.parse(atob(token.split(".")[1]));
  }

  logIn(token: any){
    return this.decodeToken(token.credential);
  }

  logOut(){
    this.setUser(null);
  }
}
