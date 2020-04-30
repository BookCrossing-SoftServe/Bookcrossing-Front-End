import {Component, OnInit, ViewChild, Input} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {LanguageService} from '../../../core/services/language/language.service';
import {Language} from '../../../core/models/languages.enum';
import {AuthenticationService} from '../../../core/services/authentication/authentication.service';
import {IUser} from '../../../core/models/user';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @ViewChild('menu', {static: false}) menu: any;
  languages: Language[];
  name;
  currentUser: IUser;
  subscription: any;
  showuser = false;

  constructor(
    private translate: TranslateService,
    private router: Router,
    public languageService: LanguageService,
    private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    this.languages = this.languageService.languages;
    this.subscription = this.authenticationService.getLoginEmitter()
      .subscribe(() => {
      });

  }

  changeLang(lang: Language): void {
    this.languageService.setLanguage(lang);
    this.translate.use(this.languageService.langToString(lang));
  }

  logout() {
    this.authenticationService.logout();
    this.showuser = false;
    this.router.navigate(['/login']);
  }
}
