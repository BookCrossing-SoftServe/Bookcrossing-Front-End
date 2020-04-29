import { IUser } from './../../models/user';
import { bookUrl } from '../../../configs/api-endpoint.constants';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IBook } from "../../models/book";
import { bookStatus } from '../../models/bookStatus.enum';
import { RequestService } from '../request/request.service';
import { IRequest } from '../../models/request';
import {PaginationService} from "../pagination/pagination.service";
import {PaginationParameters} from "../../../core/models/Pagination/paginationParameters";
import {IPage} from "../../models/page";
import {IAuthor} from "../../models/author";
import { BookParameters } from '../../models/Pagination/bookParameters';

@Injectable()
export class BookService {
  private apiUrl: string = bookUrl;
  status: bookStatus;
  currentOwner: IUser;
  firstOwner: IUser;
  userWhoRequested: IUser;
  receiveDate: Date;

  constructor(private http: HttpClient,
    private pagination: PaginationService,
    private requestService:RequestService,
    ) {}

  getBooksPage(bookParams : BookParameters): Observable<IPage<IBook>> {
    return this.pagination.getPageBooks<IBook>(bookUrl,bookParams);
  }

  getBookById(id: number): Observable<IBook> {
    return this.http.get<IBook>(this.apiUrl + id);
  }

  postBook(book: IBook) {
    return this.http.post<IBook>(this.apiUrl, book);
  }

  isBeingReding(book: IBook) : boolean {      
     this.requestService.getRequestForBook(book.id)
    .subscribe((value: IRequest) => {
      this.receiveDate = value.receiveDate
      });
      if(this.receiveDate !== null){
        return true;
      }
      return false;
  };

  getFirstOwner(): IUser{
    return null;
  }

  getCurrentOwner(userId: number) : IUser{
    return null;
  }

  getUserWhoRequested(userId: number): IUser {
    return null;
  }

  getStatus(book : IBook) : bookStatus{
    this.status = bookStatus.available;
    let requested = this.isRequested(book);
    if(requested){
      let received = this.isBeingReding(book);
      if(received){
        return bookStatus.reading;
      }
      else {
        return bookStatus.requested;
      }
    }
    return this.status;
  }
  
  isRequested(book: IBook) : boolean {      
    if(book.available === false) {
      this.status = bookStatus.requested
      return true;
    }
    return false;
  };
}
