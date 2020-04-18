import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UserList, User } from './models';
import { fromEvent } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  share,
  map,
  tap,
  partition,
  retry,
  finalize,
  switchMap
} from 'rxjs/operators';
import { UserInfoService } from './services/user-info.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('searchInput')
  input: ElementRef;
  users: User[];
  isLoading = false;

  constructor(private userInfoService: UserInfoService) {}
  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const word$ = fromEvent<any>(this.input.nativeElement, 'keyup').pipe(
      debounceTime(300),
      map((event) => event.target.value),
      distinctUntilChanged(),
      tap((word) => console.log(word)),
      share()
    );

    // https://github.com/ReactiveX/rxjs/issues/2995, https://stackoverflow.com/questions/50857298/how-to-use-rxjs6-partition-in-typescript
    const [user$, reset$] = partition<any>((words) => words.trim().length > 0)(
      word$
    );

    user$.pipe(
      tap(() => console.log('로딩시작')),
      switchMap(word => {
        return this.userInfoService.getUserInfo(word);
      }),
      tap(() => console.log('로딩끝')),
      retry(2),
      finalize(this.hideLoading)
    )
    .subscribe(userInfo => {
      this.users = userInfo.items;
    });

    reset$.pipe(tap(() => (this.users = []))).subscribe();
  }

  showLoading(): void {
    this.isLoading = true;
  }

  hideLoading(): void {
    this.isLoading = false;
  }
}
