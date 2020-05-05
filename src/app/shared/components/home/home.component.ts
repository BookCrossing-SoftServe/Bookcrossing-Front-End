import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  isAuthenticated() {
    return this.authenticationService.isAuthenticated();
  }

  onRegisterBook(expectedRoute: string, defaultRoute: string) {
    if (this.isAuthenticated()) {
      this.router.navigate([`${expectedRoute}`]);
    } else {
      this.router.navigate([`${defaultRoute}`]);
    }
  }
}
