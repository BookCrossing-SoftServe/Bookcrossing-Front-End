import {Component, OnDestroy, OnInit} from '@angular/core';
import {IBook} from 'src/app/core/models/book';
import {BookService} from 'src/app/core/services/book/book.service';
import {AuthenticationService} from 'src/app/core/services/authentication/authentication.service';
import {DialogService} from 'src/app/core/services/dialog/dialog.service';
import {TranslateService} from '@ngx-translate/core';
import {NotificationService} from 'src/app/core/services/notification/notification.service';
import {RequestService} from 'src/app/core/services/request/request.service';
import {bookState} from 'src/app/core/models/bookState.enum';
import {RequestQueryParams} from 'src/app/core/models/requestQueryParams';
import {IRequest} from 'src/app/core/models/request';
import {BookQueryParams} from '../../../core/models/bookQueryParams';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {SearchBarService} from '../../../core/services/searchBar/searchBar.service';
import {environment} from 'src/environments/environment';
import {booksPage} from '../../../core/models/booksPage.enum';

@Component({
  selector: 'app-registered-book',
  templateUrl: '../books/books.component.html',
  styleUrls: ['../books/books.component.scss']
})

export class RegisteredBookComponent implements OnInit, OnDestroy {

  isBlockView: boolean = false;
  disabledButton: boolean = false;
  books: IBook[];
  isRequester: boolean = false;
  userId: number;
  totalSize: number;
  booksPage: booksPage = booksPage.registered;
  queryParams: BookQueryParams = new BookQueryParams;
  selectedGenres: number[];
  apiUrl: string = environment.apiUrl;

  constructor(private bookService: BookService,
              private routeActive: ActivatedRoute,
              private router: Router,
              private authentication: AuthenticationService,
              private dialogService: DialogService,
              private translate: TranslateService,
              private searchBarService: SearchBarService,
              private notificationService: NotificationService,
              private requestService: RequestService) { }

  ngOnInit(): void {
    this.routeActive.queryParams.subscribe((params: Params) => {
      this.queryParams = BookQueryParams.mapFromQuery(params, 1, 8);
      this.populateDataFromQuery();
      this.getBooks(this.queryParams);
    });
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

  isAuthenticated(){
    return this.authentication.isAuthenticated();
  }
  async requestBook(bookId: number) {
    this.dialogService
      .openConfirmDialog(
        await this.translate.get("Do you want to request this book? Current owner will be notified about your request.").toPromise()
      )
      .afterClosed()
      .subscribe(async res => {
        this.disabledButton = true;
        if (res) {
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
    this.queryParams.genres = this.selectedGenres;
    if (filterChanged) {
      this.resetPageIndex();
      this.changeUrl();
    }
  }
  private populateDataFromQuery() {
    if (this.queryParams.searchTerm) {
      this.searchBarService.changeSearchTerm(this.queryParams.searchTerm);
    }
    if (typeof this.queryParams.showAvailable === 'undefined') {
      this.queryParams.showAvailable = false;
    }
    if (this.queryParams.genres) {
      let genres: number[];
      if (Array.isArray(this.queryParams.genres)) {
        genres = this.queryParams.genres.map(v => +v);
      } else {
        genres = [+this.queryParams.genres];
      }
      this.selectedGenres =  genres;
    }
  }

  // Navigation
  pageChanged(currentPage: number): void {
    this.queryParams.page = currentPage;
    this.queryParams.firstRequest = false;
    this.changeUrl();
    window.scrollTo({
      top: 0,
      behavior:'smooth'
    });
  }
  private resetPageIndex() : void {
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
    this.bookService.getRegisteredBooks(params)
      .subscribe({
        next: pageData => {
          this.books = pageData.page;
          if (pageData.totalCount) {
            this.totalSize = pageData.totalCount;
          }
        },
        error: err => {
          this.notificationService.error(this.translate
            .instant("Something went wrong!"), "X");
        }
      });
  };

  ngOnDestroy() {
    this.searchBarService.changeSearchTerm(null);
  }
  onViewModeChange(viewModeChanged: string) {
    if(viewModeChanged === 'block'){
      this.isBlockView = true;
    }
    else {
      this.isBlockView = false;
    }
  }
}
