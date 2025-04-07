import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  set(key: string, value: any) {
    localStorage.setItem(key, window.btoa(JSON.stringify(value)));
  }

  get(key: string): any {
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(window.atob(data));
    }
    return null;
  }
}
