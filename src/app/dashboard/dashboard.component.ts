import { ChangeDetectionStrategy, Component, Input, ViewChild, computed, inject, signal, viewChild } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Apollo, gql } from 'apollo-angular';
import { catchError, interval, tap } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AsyncPipe, NgClass, NgStyle } from '@angular/common';
import { BreadcrumbsComponent } from '../common/Components/breadcrumbs/breadcrumbs.component';
import { UsersComponent } from './users/users.component';
import { PostsService } from '../services/posts/posts.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  imports: [NgClass, NgStyle, BreadcrumbsComponent, UsersComponent, AsyncPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  animations: [
    trigger('a1', [
      state( 's1', style({ opacity: 1 }) ),
      state( 's2', style({ opacity: 0.5 }) ),
      transition('s1 => s2', [ animate('0.1s') ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  @Input('q') query?: string;
  @Input() id?: string;
  @Input() data?: string;
  @ViewChild('routeHeader') routeHeader;
  postsService = inject(PostsService);

  posts = [];
  postsError = '';

  a1 = true;
  asyncValue = new Promise((resolve) => setTimeout(() => resolve('Async value'), 1000));

  signals = {
    a: signal(0),
    b: computed(() => this.signals.c() ? this.signals.a() * 2 : -1 ),
    c: signal(true)
  };

  constructor(
    private readonly authService: AuthService) {}


  ngOnInit() {
    console.log(this);
    interval(1000).pipe(tap(() => this.signals.a.update( (v) => v + 1 ))).subscribe();
    interval(500).pipe(tap(() => this.signals.c.update( (v) => !v ))).subscribe();
    interval(1000).pipe(tap(() => this.a1 = !this.a1)).subscribe();
    this.postsService.getPosts()
      .pipe(catchError((error: HttpErrorResponse) => { this.postsError = error.message; return []; }))
      .subscribe((posts) => { this.posts = posts; });
  }

  logout() {
    this.authService.logout();
  }

  onKeyDown(event: Event) {
    console.log(event);
  }
}
