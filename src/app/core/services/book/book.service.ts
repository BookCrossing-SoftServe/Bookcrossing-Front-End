import { bookUrl } from '../../../configs/api-endpoint.constants';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Book } from "../../models/book";

@Injectable()
export class BookService {
  readonly baseUrl = bookUrl;

  constructor(private http: HttpClient) {}

   getBooks():Observable<Book[]>{
     return this.http.get<Book[]>(this.baseUrl);
   }

   getBookById(id:number):Observable<Book>{
     var url = this.baseUrl;
     var url_ = url.concat(id.toString());
     return this.http.get<Book>(url_)
   }

  postBook(book: Book) {
    return this.http.post<Book>(this.baseUrl, book);
  }
}
