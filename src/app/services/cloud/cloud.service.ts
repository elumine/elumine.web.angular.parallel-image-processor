import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CloudService {
  app = initializeApp(environment.firebase);
  auth = getAuth(this.app);
  analytics = getAnalytics(this.app);
  google = new GoogleAuthProvider();

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  loginGoogle() {
    return signInWithPopup(this.auth, this.google)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        return credential.accessToken;
      });
  }

  logout() {
    return signOut(this.auth);
  }
}
