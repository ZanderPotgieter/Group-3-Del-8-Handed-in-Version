import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpClientModule} from "@angular/common/http"; 
import { Observable } from 'rxjs'; 
import { User} from "./user";




@Injectable({
  providedIn: 'root'
})
export class LoginService {

 constructor(private http: HttpClient) { }

  url = 'https://localhost:44399/Api/Login'

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  registerUser(user : User){
    return this.http.post(this.url + '/registerUser', user, this.httpOptions)
  }

 loginUser(user : User){
    return this.http.post(this.url + '/loginUser', user, this.httpOptions) 
  }


  getUserDetails(session: any){
    return this.http.post(this.url + '/getUserDetails',session, this.httpOptions)
  }

  sendEmail(email: string)
  {
    return this.http.post(this.url + '/sendEmail', email, this.httpOptions);
  }

  resetPassword(user: User)
  {
    return this.http.put(this.url + './resetPassword', user, this.httpOptions)
  }
}
