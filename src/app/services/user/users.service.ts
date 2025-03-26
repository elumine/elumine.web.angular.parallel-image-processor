import { Injectable, InjectionToken, inject } from '@angular/core';
import { User } from './user';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export class UsersGetError {
  constructor(public message: string) {}
}

export abstract class UserServiceBase {
  abstract getUsers(): Observable<User[]>;
}

@Injectable()
export class UsersService extends UserServiceBase {
  http = inject(HttpClient);
  users = new Array<User>();

  constructor() { super(); }

  getUsers() {
    return this.http.get(`${environment.apiUrl}/users/get`)
      .pipe(catchError((error: HttpErrorResponse) => {
        throw new UsersGetError(`UsersGetError: ${error.message}`);
      }))
      .pipe(map((response: any[]) => response.map(u => new User(u)) ))
      .pipe(tap(users => this.users = users));
  }
}

export interface UserServiceConstants {
  VALUE: string;
}
export const USER_SERVICE_CONSTANTS_TOKEN = new InjectionToken<UserServiceConstants>('USER_SERVICE_CONSTANTS Description');
export const USER_SERVICE_CONSTANTS: UserServiceConstants = { VALUE: 'USER_SERVICE_CONSTANTS Value' };