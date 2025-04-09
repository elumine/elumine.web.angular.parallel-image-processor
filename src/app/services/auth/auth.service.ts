import { Injectable, inject } from '@angular/core';
import { SessionService } from '../session/session.service';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, from, tap } from 'rxjs';
import { Router } from '@angular/router';
import { CloudService } from '../cloud/cloud.service';

export interface LoginResponse {
  accessToken: string;
}
export interface RegistrationResponse {
  accessToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  router = inject(Router);
  cloud = inject(CloudService);
  sessionService = inject(SessionService);
  http = inject(HttpClient);

  register(email: string, password: string): Observable<RegistrationResponse> {
    return from(
      this.cloud.register(email, password)
        .then(user => ({
          accessToken: user.user.refreshToken
        }))
    );
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return from(
      this.cloud.login(email, password)
        .then(user => ({ accessToken: user.user.refreshToken }))
        .then(response => {
          this.sessionService.setSession(response.accessToken);
          return response;
        })
    );
  }

  loginGoogle(): Observable<LoginResponse> {
    return from(
      this.cloud.loginGoogle()
        .then(token => ({ accessToken: token }))
        .then(response => {
          this.sessionService.setSession(response.accessToken);
          return response;
        })
    )
  }

  logout() {
    return from(this.cloud.logout())
      .pipe(tap(() => {
        this.sessionService.clearSession();
        this.router.navigate(['/auth/login']);
      }));
  }
}
