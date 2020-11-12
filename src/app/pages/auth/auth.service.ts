import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { User, UserResponse } from '@shared/models/user.interface';
import { JwtHelperService } from '@auth0/angular-jwt';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.checkToken();
  }

  get isLogged(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }


  login(authData: User): Observable<UserResponse | void>{
    return this.http.post<UserResponse>(`${environment.API_URL}/auth/login`, authData).pipe( map ((res: UserResponse) => {
      // console.log('Res -->', res);

      this.saveToken(res.token);
      this.loggedIn.next(true);
      return res;

    }),
      catchError((err) => this.handlerError(err))
    );
  }

  logout():void{
    localStorage.removeItem('token');
    //set userIsLogged = false;
    this.loggedIn.next(false);

  }

  private checkToken(): void{
    const userToken = localStorage.getItem('token');
    const isExpired = helper.isTokenExpired(userToken);
    console.log('isExpired --> ', isExpired);

    isExpired ? this.logout() : this.loggedIn.next(true);

    /* if(isExpired){
      this.logout();
    }else{
      this.loggedIn.next(true);
    } */

  }

  private saveToken(token: string):void {
    localStorage.setItem('token', token);
  }

  private handlerError(err: any): Observable<never> {
    let errorMesaage = ' An error ocured retrievening data';
    if(err){
      errorMesaage = `Error: code ${err.message}`;
    }
    window.alert(errorMesaage);
    return throwError(errorMesaage);
  }



}
