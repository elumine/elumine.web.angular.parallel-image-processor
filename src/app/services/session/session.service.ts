import { Injectable, inject } from '@angular/core';
import { Session } from './session';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  storage = inject(StorageService);
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
      const storage = this.storage.get('session');
      const { token } = storage;
      if (typeof token !== 'string') throw new Error('No token found in storage');
      this.session = { token: storage.token };
    } catch (error) {
      this.session = null;
      console.warn('Error loading session:', error);
    }
  }

  private _save() {
    this.storage.set('session', this.session);
  }
}
