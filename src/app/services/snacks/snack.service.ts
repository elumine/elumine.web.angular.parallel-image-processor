import { Injectable, inject } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class SnackService {
  private _snackBar = inject(MatSnackBar);
  private _snackBarRef: MatSnackBarRef<any>;

  openSnackBar(messageText: string, actionText = 'okay') {
    if (this._snackBarRef) this._snackBarRef.dismiss();
    this._snackBarRef = this._snackBar.open(messageText, actionText, {
      duration: 1000,
    });
    this._snackBarRef.afterDismissed().subscribe(e => {
      this._snackBarRef = null;
    });
  }
}
