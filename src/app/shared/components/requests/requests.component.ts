import { Component, OnInit } from '@angular/core';
import { IRequest } from 'src/app/core/models/request'
import { ActivatedRoute, Params, Router } from "@angular/router";
import { NotificationService } from "../../../core/services/notification/notification.service";
import {TranslateService} from "@ngx-translate/core";
import { RequestService } from 'src/app/core/services/request/request.service'
import { DialogService } from 'src/app/core/services/dialog/dialog.service';
import { BookQueryParams } from 'src/app/core/models/bookQueryParams';
import { SearchBarService } from 'src/app/core/services/searchBar/searchBar.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
  providers: []
})
export class RequestsComponent implements OnInit {
  
  requests: IRequest[];
  totalSize: number;

  queryParams: BookQueryParams = new BookQueryParams;
  selectedGenres: number[];
  
  constructor(
    private translate: TranslateService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private requestService: RequestService,
    private searchBarService : SearchBarService,
    private router : Router,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.queryParams = BookQueryParams.mapFromQuery(params, 1, 5)  
      this.populateDataFromQuery();
      this.getUserRequests(this.queryParams);
    })
  }

  getUserRequests(params: BookQueryParams) : void {      
    this.requestService.getUserRequestsPage(params)
    .subscribe( {
      next: pageData => {
      this.requests = pageData.page;
      if(pageData.totalCount){
        this.totalSize = pageData.totalCount;
      }
    },
    error: error => this.notificationService.warn(this.translate
      .instant("An error has occured, please try again!"))
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
  onFilterChange(filterChanged : boolean){
    this.queryParams.genres = this.selectedGenres
    if(filterChanged){
      this.resetPageIndex()
      this.changeUrl();
    }
  }
  private populateDataFromQuery() {
    if(this.queryParams.searchTerm){
      this.searchBarService.changeSearchTerm(this.queryParams.searchTerm)      
    }
    if(typeof this.queryParams.showAvailable === "undefined"){
      this.queryParams.showAvailable = true;
    }      
    if(this.queryParams.genres){
      let genres: number[];
      if(Array.isArray(this.queryParams.genres))
       genres = this.queryParams.genres.map(v=>+v);
       else{
         genres = [+this.queryParams.genres];
       }
        this.selectedGenres =  genres;
    }
  } 
  pageChanged(currentPage: number): void {
    this.queryParams.page = currentPage;
    this.queryParams.firstRequest = false;
    this.changeUrl();
  }
  private resetPageIndex() : void {
    this.queryParams.page = 1;
    this.queryParams.firstRequest = true;
  }
  private changeUrl(): void {
    this.router.navigate(['.'],
      {
        relativeTo: this.route,
        queryParams: this.queryParams,
      });
  }

}
