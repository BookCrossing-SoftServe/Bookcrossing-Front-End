import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private http: HttpClient) {
  }

  async checkEmail(email: string) {
    this.http.post('', {email});
  }

  async registraion(form) {
    return this.http.post('', {form});
  }

}
