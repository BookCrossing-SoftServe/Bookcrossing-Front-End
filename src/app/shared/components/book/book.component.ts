import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { RequestService } from 'src/app/core/services/request/request.service';
import { BookService } from 'src/app/core/services/book/book.service';
import { ActivatedRoute } from '@angular/router';
import { bookUrl } from 'src/app/configs/api-endpoint.constants';
import { IBook } from "src/app/core/models/book";
import { NotificationService } from "../../../core/services/notification/notification.service";
import {TranslateService} from "@ngx-translate/core";
import { IRequest } from 'src/app/core/models/request';
import { bookStatus } from 'src/app/core/models/bookStatus.enum';
import { DialogService } from 'src/app/core/services/dialog/dialog.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  providers: [RequestService, BookService]
})
export class BookComponent implements OnInit {

    readonly baseUrl = bookUrl;
    book: IBook;
    bookId: number;
    request: IRequest;
    requestId: number;
    bookStatus: bookStatus;
    status: string;

  constructor(
    private translate: TranslateService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private bookService:BookService,
    private requestService:RequestService,
    private dialogService: DialogService
    ) {}
  
  ngOnInit() {

    this.route.paramMap.pipe(
      switchMap(params => params.getAll('id'))
  )
  .subscribe(data=> this.bookId = +data);

  this.bookService.getBookById(this.bookId).subscribe((value: IBook) => {
    this.book = value;
    this.status = this.getStatus(value);
  });
  }

  getStatus(book: IBook): string{
    this.bookStatus = this.bookService.getStatus(book);
    if(this.bookStatus == bookStatus.available){
      return "Available";
    }
    else if(this.bookStatus == bookStatus.reading){
      return "Reeding";
    }
    else if(this.bookStatus == bookStatus.requested){
      return "Requested";
    }
  }

  async cancelRequest() {
    this.dialogService
      .openConfirmDialog(
        await this.translate.get("Do you want to cancel request? Current owner will be notified about your cancelation.").toPromise()
      )
      .afterClosed()
      .subscribe(async res => {
        if (res) {
          this.requestService.getRequestForBook(this.bookId).subscribe((value: IRequest) => {
            this.requestId = value.id;
            });
          this.requestService.deleteRequest(this.requestId).subscribe((value: boolean) => {
            let canceled = value;
            if(canceled){
              this.notificationService.success(this.translate
                .instant("Request is cancelled."));
            }
            }, err => {
              this.notificationService.warn(this.translate
                .instant("Something went wrong!"));
            });
        }
      });

  }
  async startReading() {
    this.dialogService
      .openConfirmDialog(
        await this.translate.get("Do you want to start reading? You will be shown as current owner.").toPromise()
      )
      .afterClosed()
      .subscribe(async res => {
        if (res) {
          this.requestService.approveReceive(this.bookId).subscribe((value: boolean) => {
            let received = value;
            if(received){
              this.notificationService.success(this.translate
                .instant("Request is cancelled."));
            }
            }, err => {
              this.notificationService.warn(this.translate
                .instant("Something went wrong!"));
            });
        }
      });

  }

  async requestBook() {
    this.dialogService
      .openConfirmDialog(
        await this.translate.get("Do you want to request this book? Current owner will be notified about your request.").toPromise()
      )
      .afterClosed()
      .subscribe(async res => {
        if (res) {
          this.requestService.requestBook(this.bookId).subscribe((value: IRequest) => {
            this.request = value;
            this.notificationService.success(this.translate
              .instant("Book is successfully requested. Please contact with current owner to receive a book"));
            }, err => {
              this.notificationService.warn(this.translate
                .instant("Something went wrong!"));
            });
        }
      });

  }

}
