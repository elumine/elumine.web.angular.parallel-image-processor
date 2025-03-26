import { Injectable } from '@angular/core';
import { Session } from './session';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  session: Session;

  constructor() {
    this._load();
  }

  get sessionExists() { return !!this.session?.token }

  clearSession() {
    this.session = null;
    this._save();
  }

  setSession(token: string) {
    this.session = { token };
    this._save();
  }

  private _load() {
    try {
      const storage = JSON.parse(localStorage.getItem('session'));
      const { token } = storage;
      if (typeof token !== 'string') throw new Error('No token found in storage');
      this.session = { token: storage.token };
    } catch (error) {
      this.session = null;
      console.warn('Error loading session:', error);
    }
  }

  private _save() {
    localStorage.setItem('session', JSON.stringify(this.session));
  }
}
