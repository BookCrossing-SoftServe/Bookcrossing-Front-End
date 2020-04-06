import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAuthor } from 'src/app/core/models/author'
import { authorUrl } from "src/app/configs/api-endpoint.constants";
import { IPage } from '../../models/page';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  constructor(private http: HttpClient,) {}


  getAuthorsPage(page : number, pageSize : number = 10, firstRequest : boolean = true, searchQuery? : string):Observable<IPage<IAuthor>>{
    let params = new HttpParams()
                  .set("page", page.toString())
                  .set("pageSize", pageSize.toString())
                  .set("firstRequest", firstRequest.toString())
    if(searchQuery){
      params = params.set("searchQuery", searchQuery)
    }
    return this.http.get<IPage<IAuthor>>(authorUrl,{params});
  }
  getAuthorById(authorId: number) {
    return this.http.get<IAuthor[]>(authorUrl + `/${authorId}`);
  }
  addAuthor(author : IAuthor){
    return this.http.post<IAuthor>(authorUrl, author);
  }
  deleteAuthor(authorId: number) {
    return this.http.delete<IAuthor>(authorUrl + `/${authorId}`);
  }
  updateAuthor(author: IAuthor) {
    return this.http.put<IAuthor>(authorUrl, author);
  }
}
