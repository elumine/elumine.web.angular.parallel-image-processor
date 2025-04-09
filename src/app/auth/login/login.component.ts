import { Component } from '@angular/core';
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, LoginResponse } from '../../services/auth/auth.service';
import { catchError } from 'rxjs';
import { Router } from '@angular/router';
import { UppercasePipe } from '../../common/pipes/uppercase/uppercase.pipe';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { SnackService } from '../../services/snacks/snack.service';
import { TextInputComponent } from '../../common/components/text-input/text-input.component';


@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule, TextInputComponent, 
    UppercasePipe, MatButtonModule, MatCardModule, MatRippleModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  form = new FormGroup({
    username: new FormControl('myemail@email.com', [
      Validators.minLength(6),
      Validators.required
    ]),
    password: new FormControl('mypassword', [
      Validators.minLength(6),
      Validators.required
    ])
  });

  constructor(
    private router: Router,
    private authService: AuthService,
    private snack: SnackService) {}

  login() {
    if (this.form.valid) {
      this.authService.login(this.form.value.username, this.form.value.password)
        .pipe(
          catchError((error) => {
            this.snack.openSnackBar(`Login error. ${error.message}`);
            return [];
          })
        )
        .subscribe((user: LoginResponse) => {
          this.snack.openSnackBar(`Login success`);
          this.router.navigate(['dashboard']);
        });
    }
  }

  googleLogin() {
    this.authService.loginGoogle()
      .pipe(
        catchError((error) => {
          this.snack.openSnackBar(`Login error. ${error.message}`);
          return [];
        })
      )
      .subscribe((user: LoginResponse) => {
        this.snack.openSnackBar(`Login success`);
        this.router.navigate(['dashboard']);
      });
  }
}
