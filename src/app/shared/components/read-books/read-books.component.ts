import {Component, OnDestroy, OnInit} from '@angular/core';
import {IBook} from '../../../core/models/book';
import {BookQueryParams} from '../../../core/models/bookQueryParams';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {BookService} from '../../../core/services/book/book.service';
import {SearchBarService} from '../../../core/services/searchBar/searchBar.service';
import {IUser} from '../../../core/models/user';
import { RequestService } from 'src/app/core/services/request/request.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'src/app/core/services/dialog/dialog.service';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { bookState } from 'src/app/core/models/bookState.enum';
import { RequestQueryParams } from 'src/app/core/models/requestQueryParams';
import { IRequest } from 'src/app/core/models/request';
import { environment } from 'src/environments/environment';
import { booksPage } from 'src/app/core/models/booksPage.enum';

@Component({
  selector: 'app-read-books',
  templateUrl: '../books/books.component.html',
  styleUrls: ['../books/books.component.scss']
})

export class ReadBooksComponent implements OnInit, OnDestroy {

  isBlockView: boolean = false;
  userId: number;
  isRequester: boolean[] = [undefined, undefined, undefined, undefined, undefined ,undefined, undefined, undefined];
  disabledButton: boolean = false;
  booksPage: booksPage = booksPage.read;
  books: IBook[];
  totalSize: number;
  queryParams: BookQueryParams = new BookQueryParams;
  apiUrl: string = environment.apiUrl;

  selectedGenres: number[];


  constructor(private bookService: BookService,
    private routeActive: ActivatedRoute,
    private router: Router,
    private authentication: AuthenticationService,
    private dialogService: DialogService,
    private translate: TranslateService,
    private searchBarService: SearchBarService,
    private notificationService: NotificationService,
    private requestService: RequestService
  ) { }

  ngOnInit(): void {
    this.getUserId()
    this.routeActive.queryParams.subscribe((params: Params) => {
      this.queryParams = BookQueryParams.mapFromQuery(params, 1, 8)
      this.populateDataFromQuery();
      this.getBooks(this.queryParams);
    });
  }

  getUserId(){
    if (this.isAuthenticated()) {
      this.authentication.getUserId().subscribe((value: number) => {
        this.userId = value;
      });
    }
  }

  getUserWhoRequested(book: IBook, key: number) {
    if (book.state === bookState.requested) {
      const query = new RequestQueryParams();
      query.first = false;
      query.last = true;
      this.requestService.getRequestForBook(book.id, query).subscribe((value: IRequest) => {
        if (this.userId === value.user.id) {
          this.isRequester[key] = true;
        }
      });
    }
  }
  onViewModeChange(viewModeChanged: string) {
    if(viewModeChanged === 'block'){
      this.isBlockView = true;
    }
    else {
      this.isBlockView = false;
    }
  }
  isAuthenticated(){
    return this.authentication.isAuthenticated();
  }
  async cancelRequest(bookId: number) {
    this.dialogService
      .openConfirmDialog(
        await this.translate.get("Do you want to cancel request? Current owner will be notified about your cancellation.").toPromise()
      )
      .afterClosed()
      .subscribe(async res => {
        if (res) {
          this.disabledButton = true;
          this.requestService.deleteRequest(bookId).subscribe(() => {
            this.disabledButton = false;
            this.ngOnInit();
            this.notificationService.success(this.translate
              .instant("Request is cancelled."), "X");
          }, err => {
            this.disabledButton = false;
            this.notificationService.error(this.translate
              .instant("Something went wrong!"), "X");
          });
        }
      });
  }

  async requestBook(bookId: number) {
    this.dialogService
      .openConfirmDialog(
        await this.translate.get("Do you want to request this book? Current owner will be notified about your request.").toPromise()
      )
      .afterClosed()
      .subscribe(async res => {
        if (res) {
          this.disabledButton = true;
          this.requestService.requestBook(bookId).subscribe((value: IRequest) => {
            this.disabledButton = false;
            this.ngOnInit();
            this.notificationService.success(this.translate
              .instant("Book is successfully requested. Please contact with current owner to receive a book"), "X");
            }, err => {
            this.disabledButton = false;
              this.notificationService.error(this.translate
                .instant("Something went wrong!"), "X");
            });
        }
      });
    }
  onFilterChange(filterChanged: boolean) {
    this.queryParams.genres = this.selectedGenres
    if (filterChanged) {
      this.resetPageIndex()
      this.changeUrl();
    }
  }
  private populateDataFromQuery() {
    if (this.queryParams.searchTerm) {
      this.searchBarService.changeSearchTerm(this.queryParams.searchTerm)
    }
    if (typeof this.queryParams.showAvailable === 'undefined') {
      this.queryParams.showAvailable = false;
    }
    if (this.queryParams.genres) {
      let genres: number[];
      if (Array.isArray(this.queryParams.genres)) {
        genres = this.queryParams.genres.map(v => +v);
      }
      else {
        genres = [+this.queryParams.genres];
      }
      this.selectedGenres =  genres;
    }
  }

  //Navigation
  pageChanged(currentPage: number): void {
    this.queryParams.page = currentPage;
    this.queryParams.firstRequest = false;
    this.changeUrl();
  }
  private resetPageIndex(): void {
    this.queryParams.page = 1;
    this.queryParams.firstRequest = true;
  }
  private changeUrl(): void {
    this.router.navigate(['.'],
      {
        relativeTo: this.routeActive,
        queryParams: this.queryParams,
      });
  }


  //get
  getBooks(params: BookQueryParams): void {
    this.bookService.getReadBooks(params)
      .subscribe({
        next: pageData => {
          this.books = pageData.page;
          for(var i = 0; i<pageData.page.length; i++){

            this.getUserWhoRequested(pageData.page[i], i)
          }
          if (pageData.totalCount) {
            this.totalSize = pageData.totalCount;
          }
        },
        error: error => {
          alert('An error has occured, please try again');
        }
      });
  }

  ngOnDestroy() {
    this.searchBarService.changeSearchTerm(null);
  }
}
