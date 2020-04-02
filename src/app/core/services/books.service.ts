import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book'

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(private http:HttpClient) { }

   getBooks():Observable<Book[]>{
     return this.http.get<Book[]>("https://localhost:44370/api/Books");
   }

   getBookById(id:number):Observable<Book>{
     var url = "https://localhost:44370/api/Books/";
     var url_ = url.concat(id.toString());
     return this.http.get<Book>(url_)
   }


}
