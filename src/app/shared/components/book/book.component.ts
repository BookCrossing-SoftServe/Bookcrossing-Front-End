import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { RequestService } from 'src/app/core/services/request/request.service';
import { BooksService } from 'src/app/core/services/books.service';
import { ActivatedRoute } from '@angular/router';
import { bookUrl } from 'src/app/configs/api-endpoint.constants';
<<<<<<< HEAD
import { Book } from "src/app/core/models/book";
=======
import { IBook } from "src/app/core/models/book";
>>>>>>> 7a78a37fb38157ac49f857c8bcce14785a9f5cc1

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  providers: [RequestService, BooksService]
})
export class BookComponent implements OnInit {

    readonly baseUrl = bookUrl;
<<<<<<< HEAD
    book: Book;
=======
    book: IBook;
>>>>>>> 7a78a37fb38157ac49f857c8bcce14785a9f5cc1
    bookId: number;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private bookService:BooksService,
    private requestService:RequestService
    ) {}
  
  ngOnInit() {

    this.route.paramMap.pipe(
      switchMap(params => params.getAll('id'))
  )
  .subscribe(data=> this.bookId = +data);

<<<<<<< HEAD
  this.bookService.getBookById(this.bookId).subscribe((value: Book) => {
=======
  this.bookService.getBookById(this.bookId).subscribe((value: IBook) => {
>>>>>>> 7a78a37fb38157ac49f857c8bcce14785a9f5cc1
    this.book = value;
  });
  }
  

}
