
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {LoginComponent} from './shared/components/login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RegistrationComponent} from './shared/components/registration/registration.component';
import {BookService} from './core/services/book/book.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSelectModule} from '@angular/material/select';
import {BookComponent} from './shared/components/book/book.component';
import {RequestsComponent} from './shared/components/requests/requests.component';
import {NavbarComponent} from './shared/components/navbar/navbar.component';
import {FooterComponent} from './shared/components/footer/footer.component';
import {BooksComponent} from './shared/components/books/books.component';
import {AddBookComponent} from './shared/components/add-book/add-book.component';
import {AuthorsComponent} from './shared/components/authors/authors.component';
import {AuthorFormComponent} from './shared/components/author-form/author-form.component';
import {ReportsComponent} from './shared/components/reports/reports.component';
import {FilterPipe} from './shared/pipes/filter.pipe';
import {RefDirective} from './shared/directives/ref.derictive';
import {AdminComponent} from './shared/components/admin/admin.component';
import {JwtInterceptor} from './shared/validators/jwt.interceptor';
import {ErrorInterceptor} from './shared/validators/error.interceptor';
import { DemoComponent } from './shared/components/demo/demo.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    AddBookComponent,
    BookComponent,
    RequestsComponent,
    NavbarComponent,
    FooterComponent,
    BooksComponent,
    AddLocationComponent,
    MapboxComponent,
    AuthorsComponent,
    AuthorFormComponent,
    ReportsComponent,
    FilterPipe,
    RefDirective,
    AdminComponent,
    DemoComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatMenuModule,
    MatIconModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    BrowserAnimationsModule,
    MatSelectModule,
  ],
  providers: [
    BookService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    LanguageService,
    CookieService,
    LocationService

  ],
  entryComponents: [AuthorFormComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
