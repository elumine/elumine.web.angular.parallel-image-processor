import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { USER_SERVICE_CONSTANTS, USER_SERVICE_CONSTANTS_TOKEN, UserServiceBase, UsersGetError, UsersService } from '../../services/user/users.service';
import { catchError } from 'rxjs';
import { MyDirectiveDirective } from '../../common/directives/my-directive/my-directive.directive';

@Component({
  selector: 'app-users',
  imports: [ MyDirectiveDirective ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: UserServiceBase,
      useClass: UsersService  // Provide the UsersService as the UserServiceBase
    }, {
      provide: USER_SERVICE_CONSTANTS_TOKEN,
      useValue: USER_SERVICE_CONSTANTS
    }
  ]
})
export class UsersComponent {
  usersService = inject(UserServiceBase);
  userServiceConstants = inject(USER_SERVICE_CONSTANTS_TOKEN);
  errorMessage = signal('');

  ngOnInit() {
    console.info('UsersComponent.ngOnInit()', this);
    this.usersService.getUsers()
      .pipe(catchError((err: UsersGetError) => {
        this.errorMessage.set(err.message);
        return [];
      }))
      .subscribe();
  }
}
