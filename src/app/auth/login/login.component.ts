import { Component } from '@angular/core';
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MyTextInputComponent } from '../../common/Components/my-text-input/my-text-input.component';
import { AuthService } from '../../services/auth/auth.service';
import { catchError } from 'rxjs';
import { Router } from '@angular/router';
import { UppercasePipe } from '../../common/pipes/uppercase/uppercase.pipe';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';


@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule, MyTextInputComponent, 
    UppercasePipe, MatButtonModule, MatCardModule, MatRippleModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  form = new FormGroup({
    username: new FormControl('emilys', [
      Validators.minLength(6),
      Validators.required
    ]),
    password: new FormControl('emilyspass', [
      Validators.minLength(6),
      Validators.required
    ])
  });

  loginStatus = {
    message: '',
    isError: false
  };

  constructor(
    private router: Router,
    private authService: AuthService) {}

  async onSubmit() {
    if (this.form.valid) {
      this.authService.login(this.form.value.username, this.form.value.password)
        .pipe(
          catchError((error) => {
            this.loginStatus = {
              isError: true,
              message: error.message
            };
            return [];
          })
        )
        .subscribe(() => {
          this.loginStatus = {
            isError: false,
            message: 'Logged in!'
          };
          this.router.navigate(['boards']);
        });
    }
  }
}
