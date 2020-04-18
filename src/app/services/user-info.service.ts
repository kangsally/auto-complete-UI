import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { UserList } from '../models';
import { tap, retry, finalize, switchAll, catchError} from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserInfoService {
  apiUrl:string = 'https://api.github.com/search/users';

  constructor(private http: HttpClient) {}

  getUserInfo(word: string, showloadFunc, hideLoadFunc): Observable<UserList> {
    const params = new HttpParams().set('q', word);

    return this.http.get<UserList>(this.apiUrl, { params })
      .pipe(
        tap(showloadFunc),
        catchError(this.handleError),
        switchAll<UserList>(),
        tap(hideLoadFunc),
        retry(2),
        finalize(hideLoadFunc),
      )
  }

  private handleError(error: HttpErrorResponse){
    let message: string = '';
    // client 에러
    if(error.error instanceof ErrorEvent){
      console.error(`Client-side error: ${error.error.message}`);
      message = error.error.message;
    }else{
      // server 에러
      console.error(`Server-side error: ${error.status}`);
      message = error.message;
    }

    return throwError({
      title: 'sorry, something wrong',
      message
    })
  }
}
