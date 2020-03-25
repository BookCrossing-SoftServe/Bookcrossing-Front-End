import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { requestUrl } from "src/app/configs/api-endpoint.constants";
import { Observable } from 'rxjs';
import { author } from 'src/app/core/models/author'

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  constructor(    private http: HttpClient, ) {}

  readonly baseUrl = "https://localhost:44370/api/Authors";

  getAuthors():Observable<author[]>{
    return this.http.get<author[]>(this.baseUrl);
  }
  getAuthorById(authorId: number) {
    return this.http.get<author[]>(this.baseUrl + `/${authorId}`);
  }
  addAuthor(author : author){
    return this.http.put<author>(this.baseUrl, {
      author: author,
    });
  }
  deleteAuthor(authorId: number) {
    return this.http.delete<author>(this.baseUrl + `/${authorId}`);
  }
  updateAuthor(authorId: number) {
    return this.http.put<author>(this.baseUrl + `/${authorId}`, {
      authorId: authorId,
    });
  }
}
