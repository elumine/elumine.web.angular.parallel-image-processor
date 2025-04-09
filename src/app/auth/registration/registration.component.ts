import { Component } from '@angular/core';
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, RegistrationResponse } from '../../services/auth/auth.service';
import { catchError } from 'rxjs';
import { Router } from '@angular/router';
import { UppercasePipe } from '../../common/pipes/uppercase/uppercase.pipe';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { SnackService } from '../../services/snacks/snack.service';
import { TextInputComponent } from '../../common/components/text-input/text-input.component';


@Component({
  selector: 'app-registration',
  imports: [
    ReactiveFormsModule, TextInputComponent, 
    UppercasePipe, MatButtonModule, MatCardModule, MatRippleModule
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
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

  async onSubmit() {
    if (this.form.valid) {
      this.authService.register(this.form.value.username, this.form.value.password)
        .pipe(
          catchError((error) => {
            this.snack.openSnackBar(`Registration error. ${error.message}`);
            return [];
          })
        )
        .subscribe((user: RegistrationResponse) => {
          this.snack.openSnackBar(`Registration success`);
          this.router.navigate(['auth/login']);
        });
    }
  }
}
