import { Component, OnInit } from '@angular/core';
import { IRequest } from 'src/app/core/models/request'
import { ActivatedRoute, Params, Router } from "@angular/router";
import { switchMap } from 'rxjs/operators';
import { NotificationService } from "../../../core/services/notification/notification.service";
import {TranslateService} from "@ngx-translate/core";
import { PaginationParameters } from 'src/app/core/models/Pagination/paginationParameters';
import { RequestService } from 'src/app/core/services/request/request.service'
import { PaginationService } from 'src/app/core/services/pagination/pagination.service';
import { FilterParameters } from 'src/app/core/models/Pagination/FilterParameters';
import { SortParameters } from 'src/app/core/models/Pagination/SortParameters';
import { DialogService } from 'src/app/core/services/dialog/dialog.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
  providers: []
})
export class RequestsComponent implements OnInit {
  
  bookId: number;
  requests: IRequest[];
  queryParams : PaginationParameters = new PaginationParameters()
  searchText : string;
  searchField :string = "id";
  totalSize : number;  
  
  constructor(
    private translate: TranslateService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private requestService: RequestService,
    private paginationService : PaginationService,
    private router : Router,
    private dialogService: DialogService
  ) {}

  ngOnInit() {

    this.route.paramMap.pipe(
      switchMap(params => params.getAll('id'))
  )
  .subscribe(data=> this.bookId = +data);
  this.route.queryParams.subscribe((params : Params) => {
    this.queryParams = this.paginationService.mapFromqQueryToPaginationParams(params)
    this.searchText = this.queryParams?.filters[0]?.value;
    this.getAllUserRequests(this.queryParams);
  })
  }
  getAllUserRequests(params : PaginationParameters) : void {      
    this.requestService.getAllUserRequests(params)
    .subscribe( {
      next: pageData => {
      this.requests = pageData.page;
      if(pageData.totalCount){
        this.totalSize = pageData.totalCount;
      }
    },
    error: error => this.notificationService.warn(this.translate
      .instant("Something went wrong!"))
   });   
  };

  async cancelRequest(requestId: number) {
    this.dialogService
      .openConfirmDialog(
        await this.translate.get("Do you want to cancel request? Current owner will be notified about your cancelation.").toPromise()
      )
      .afterClosed()
      .subscribe(async res => {
        if (res) {
          this.requestService.deleteRequest(requestId).subscribe((value: boolean) => {
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
  search() : void{
    if(this.queryParams?.filters[0]?.value == this.searchText){
      return
    }  
    this.queryParams.page = 1;
    this.queryParams.filters[0] = <FilterParameters> {propertyName:this.searchField, value: this.searchText}
    this.changeUrl(this.queryParams);
  }
  changeSort(selectedHeader : string){  
    this.queryParams.sort = <SortParameters> {orderByField:selectedHeader, orderByAscending: !this.queryParams.sort.orderByAscending}
    this.changeUrl(this.queryParams);
  }
  pageChanged(currentPage : number) : void{      
      this.queryParams.page = currentPage; 
      this.queryParams.firstRequest = false; 
      this.changeUrl(this.queryParams);
  }
  private changeUrl(params : PaginationParameters)  : void{
    this.router.navigate(['.'], 
      {
        relativeTo: this.route, 
        queryParams: this.paginationService.mapToQueryObjectPagination(params),
        queryParamsHandling: 'merge',
      });
  }  
}
