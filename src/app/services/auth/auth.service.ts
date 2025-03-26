import { Injectable, inject } from '@angular/core';
import { SessionService } from '../session/session.service';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Router } from '@angular/router';


export interface LoginResponse {
  accessToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  router = inject(Router);

  constructor(
    private readonly sessionService: SessionService,
    private readonly http: HttpClient) { }

  login(username: string, password: string) {
    return this.http.post<LoginResponse>('https://dummyjson.com/auth/login', { username, password })
      .pipe(
        tap((response) => {
          this.sessionService.setSession(response.accessToken);
        })
      );
  }

  logout() {
    this.sessionService.clearSession();
    this.router.navigate(['/auth/login']);
  }
}
