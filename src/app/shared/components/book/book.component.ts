import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { RequestService } from 'src/app/core/services/request/request.service';
import { ActivatedRoute } from '@angular/router';
import { bookUrl } from 'src/app/configs/api-endpoint.constants';
// import { Book } from "src/app/core/models/book/book";

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {

    readonly baseUrl = bookUrl;
    book: Book;
    bookId: number;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
    ) {}
  
  ngOnInit() {

    this.route.paramMap.pipe(
      switchMap(params => params.getAll('id'))
  )
  .subscribe(data=> this.bookId = +data);
  this.getBookById(this.bookId);

  }
  
  getBookById(bookId: number) {
    return this.http.get<Book>(this.baseUrl + `/${bookId}`).subscribe((value: Book) => {
      this.book = value;
    });
  }

}
