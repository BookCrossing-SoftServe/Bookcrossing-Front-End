import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor( private router: Router) {
  }
  navigateToSingUp() {
    this.router.navigate(['/registration']);
  }


  ngOnInit(): void {
  }


  singIn(loginFrom: NgForm) {
  }
}
