import { Component, OnInit } from '@angular/core';
import { IBook } from 'src/app/core/models/book';
import { BookService } from 'src/app/core/services/book/book.service';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { DialogService } from 'src/app/core/services/dialog/dialog.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { RequestService } from 'src/app/core/services/request/request.service';
import { bookStatus } from 'src/app/core/models/bookStatus.enum';
import { BookQueryParams } from 'src/app/core/models/bookQueryParams';
import { RequestQueryParams } from 'src/app/core/models/requestQueryParams';
import { IRequest } from 'src/app/core/models/request';

@Component({
  selector: 'app-registered-book',
  templateUrl: './registered-book.component.html',
  styleUrls: ['./registered-book.component.scss']
})
export class RegisteredBookComponent implements OnInit {

  books: IBook[];
  totalSize: number;
  bookStatus: bookStatus[] = [1,1,1,1,1]
  queryParams: BookQueryParams = new BookQueryParams;
  constructor(private bookService: BookService,
    private authentication: AuthenticationService,
    private dialogService: DialogService,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private requestService: RequestService) { }

  ngOnInit(): void {
    this.bookService.getRegisteredBooks().subscribe(books_=>{
      this.books = books_;
    });
  }

  isAuthenticated(){
    return this.authentication.isAuthenticated();
  }
  getStatus(book : IBook, index: number){
    if(book.available){
      this.bookStatus[index] = bookStatus.available
    }
    else{
      let query = new RequestQueryParams();
      query.first = false;
      query.last = true;    
      this.requestService.getRequestForBook(book.id, query)
     .subscribe((value: IRequest) => {
         if(value.receiveDate){
           this.bookStatus[index] = bookStatus.reading
         }
         else{
           this.bookStatus[index] = bookStatus.requested
         }
       }, error => {})
    }
  }
  async requestBook(bookId: number) {
    this.dialogService
      .openConfirmDialog(
        await this.translate.get("Do you want to request this book? Current owner will be notified about your request.").toPromise()
      )
      .afterClosed()
      .subscribe(async res => {
        if (res) {
          this.requestService.requestBook(bookId).subscribe((value: IRequest) => {
            this.notificationService.success(this.translate
              .instant("Book is successfully requested. Please contact with current owner to receive a book"), "X");
            }, err => {
              this.notificationService.warn(this.translate
                .instant("Something went wrong!"), "X");
            });
        }
      });

  }
}
