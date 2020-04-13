import {Component} from '@angular/core';
import {NavbarComponent} from './shared/components/navbar/navbar.component';
import {Router} from '@angular/router';

import {AuthenticationService} from '../app/core/services/authentication/authentication.service';
import {Role} from '../app/core/models/role';
import {IUser} from '../app/core/models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']

})
export class AppComponent {
  currentUser: IUser;
  title = 'BookCrossingFrontEnd';

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }


  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }


}
