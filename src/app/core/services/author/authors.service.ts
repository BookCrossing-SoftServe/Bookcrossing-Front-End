import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAuthor } from 'src/app/core/models/author'

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  constructor(    private http: HttpClient, ) {}

  readonly baseUrl = "https://localhost:44370/api/Authors";

  getAuthors():Observable<IAuthor[]>{
    return this.http.get<IAuthor[]>(this.baseUrl);
  }
  getAuthorById(authorId: number) {
    return this.http.get<IAuthor[]>(this.baseUrl + `/${authorId}`);
  }
  addAuthor(author : IAuthor){
    return this.http.post<IAuthor>(this.baseUrl, author);
  }
  deleteAuthor(authorId: number) {
    return this.http.delete<IAuthor>(this.baseUrl + `/${authorId}`);
  }
  updateAuthor(author: IAuthor) {
    return this.http.put<IAuthor>(this.baseUrl, author);
  }
}
