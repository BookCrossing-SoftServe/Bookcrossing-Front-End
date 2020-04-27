import {Component, ComponentFactoryResolver, OnInit} from '@angular/core';
import { IBook } from 'src/app/core/models/book';
import { BookService } from 'src/app/core/services/book/book.service';
import {PaginationParameters} from "../../../core/models/Pagination/paginationParameters";
import {ActivatedRoute, Params, Router} from "@angular/router";
import { PaginationService } from 'src/app/core/services/pagination/pagination.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {

  books:IBook[];
  queryParams : PaginationParameters = new PaginationParameters();
  searchText : string;
  totalSize : number;
  isReportTableToggled : boolean = false;


  constructor(private routeActive : ActivatedRoute,
              private router : Router,
              private bookService:BookService,
              private paginationService : PaginationService,
              private resolver: ComponentFactoryResolver
              ) { }

  ngOnInit(): void {
    this.routeActive.queryParams.subscribe((params : Params) => {      
      this.queryParams = this.paginationService.mapToPaginationParams(params,1,5)
      this.searchText = params.searchQuery;
      this.getBooks(this.queryParams);
    })
  }

  pageChanged(currentPage : number) : void{
    this.queryParams.page = currentPage;
    this.queryParams.firstRequest = false;
    this.changeUrl(this.queryParams);
  }
  private changeUrl(params : PaginationParameters)  : void{
    this.router.navigate(['.'],
      {
        relativeTo: this.routeActive,
        queryParams: params
      });
  }


  //get
  getBooks(params : PaginationParameters) : void {
    this.bookService.getBooksPage(params)
      .subscribe( {
        next: pageData => {
          console.log(pageData);
          this.books = pageData.page;
          if(pageData.totalCount){
            this.totalSize = pageData.totalCount;
          }
        },
        error: error => {
          alert("An error has occured, please try again");
        }
      });
  };

  makeRequest(bookId:number):void{
    alert(bookId);
  }



}
