import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/core/models/book';
import { BookService } from 'src/app/core/services/book/book.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {

  books:Book[];
  constructor(private bookService:BookService) { }

  ngOnInit(): void {
    this.bookService.getBooks().subscribe(books_=>{
this.books = books_;
    });

  }

}
