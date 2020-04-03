import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Book } from "../models/book";
import { bookUrl } from 'src/app/configs/api-endpoint.constants';

@Injectable()
export class BooksService {
  private apiUrl: string = bookUrl;

  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(this.apiUrl + id);
  }

  postBook(book: Book) {
    return this.http.post<Book>(this.apiUrl, book);
  }
}
