import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
} from '@angular/common/http';
import { UserList } from '../models';
import { tap, retry, finalize, switchAll, catchError, switchMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserInfoService {
  apiUrl = 'https://api.github.com/search/users';

  constructor(private http: HttpClient) {}

  getUserInfo(word: any): Observable<UserList> {
    const params = new HttpParams().set('q', word);
    return this.http.get<UserList>(this.apiUrl, { params })
      // .pipe(
      //   catchError(this.handleError),
      // );
  }

  // private handleError(error: HttpErrorResponse, observable: Observable<UserList>) {
  //   let message = '';
  //   // client 에러
  //   if (error.error instanceof ErrorEvent) {
  //     console.error(`Client-side error: ${error.error.message}`);
  //     message = error.error.message;
  //   } else {
  //     // server 에러
  //     console.error(`Server-side error: ${error.status}`);
  //     message = error.message;
  //   }

  //   return observable;
  //   // return throwError({
  //   //   title: 'sorry, something wrong',
  //   //   message,
  //   // });
  // }
}
