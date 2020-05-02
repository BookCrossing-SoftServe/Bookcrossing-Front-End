import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPage } from '../../models/page';
import { CompletePaginationParams } from 'src/app/core/models/completePaginationParameters';
import { HttpParams, HttpClient } from '@angular/common/http';
import { PageableParameters } from '../../models/Pagination/pageableParameters';
import { BookQueryParams } from '../../models/bookQueryParams';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  constructor(private http: HttpClient) { }
  getPaginationPage<T>(getUrl: string, paginationParameters: CompletePaginationParams): Observable<IPage<T>> {
    let params = new HttpParams();
    params = paginationParameters.getHttpParams();
    return this.http.get<IPage<T>>(getUrl, { params });
  }
  getBookPage<T>(getUrl: string, bookParams: BookQueryParams): Observable<IPage<T>> {
    let params = new HttpParams();
    params = bookParams.getHttpParams();
    return this.http.get<IPage<T>>(getUrl, { params });
  }
  getPage<T>(getUrl: string, pagination: PageableParameters) : Observable<IPage<T>> {
    let params = new HttpParams();
    params = pagination.mapPagination(params, pagination)
    return this.http.get<IPage<T>>(getUrl, { params });
  }

}


/*import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPage } from '../../models/page';
import { PaginationParameters } from 'src/app/core/models/Pagination/paginationParameters';
import { HttpParams, HttpClient } from '@angular/common/http';
import { FilterParameters } from '../../models/Pagination/FilterParameters';
import { SortParameters } from '../../models/Pagination/SortParameters';
import { PageableParameters } from '../../models/Pagination/pageableParameters';
import { BookParameters } from '../../models/Pagination/bookParameters';
import { bookStatus } from '../../models/bookStatus.enum';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  private page = "page";
  private pageSize = "pageSize";
  private firstRequest = "firstRequest";

  private sortField = "Sort.OrderByField";
  private sortAscending = "Sort.OrderByAscending";

  private filterPropertyName = "PropertyName";
  private filterValue = "Value";
  private filterMethod = "Method";
  private filterOperand = "Operand";
  private filterName = "Filters";

  private gernreArrayName = "Genres";
  private showAvailable = "showAvailable";
  private location = "location";
  private searchTerm = "searchTerm";

  constructor(private http: HttpClient) { }
  //Build request
  getPage<T>(getUrl: string, paginationParameters: PaginationParameters): Observable<IPage<T>> {
    let params = new HttpParams();
    params = this.mapPagination(params, paginationParameters)
    if (paginationParameters.filters) {
      params = this.mapFilter(params, paginationParameters.filters);
    }
    if (paginationParameters.sort) {
      params = this.mapSort(params, paginationParameters.sort);
    }
    return this.http.get<IPage<T>>(getUrl, { params });
  }
  getPageBooks<T>(getUrl: string, bookParams: BookParameters): Observable<IPage<T>> {
    let params = new HttpParams();
    params = this.mapPagination(params, bookParams)
    if(bookParams.searchTerm){
      params = params.set(this.searchTerm, bookParams.searchTerm);
    }
    if(bookParams.location){
      params = params.set(this.location, bookParams.location.toString())
    }      
    if(typeof bookParams.showAvailable !== "undefined"){
      params = params.set(this.showAvailable, bookParams.showAvailable.toString());
    }
    if(bookParams.genres?.length > 0){
      for(let id of bookParams.genres){
        params = params.append("genres",id.toString());
      }
    }
    return this.http.get<IPage<T>>(getUrl, { params });
  }
  //Swap names with GetPage
  getPageOnly<T>(getUrl: string, pagination: PageableParameters) : Observable<IPage<T>> {
    let params = new HttpParams();
    params = this.mapPagination(params, pagination)
    return this.http.get<IPage<T>>(getUrl, { params });
  }
  //Map to query string, for request
  private mapFilter(params: HttpParams, filters: FilterParameters[], filterName = this.filterName): HttpParams {    
    for (let i = 0; i < filters.length; i++) {
      if (filters[i].propertyName && filters[i].value) {
        params = params
          .set(this.getFilterName(i, filterName, this.filterPropertyName), filters[i].propertyName)
          .set(this.getFilterName(i, filterName, this.filterValue), filters[i].value);

        if (filters[i].method) {
          params = params.set(this.getFilterName(i, filterName, this.filterMethod), filters[i].method)
        }
        if (filters[i].operand) {
          params = params.set(this.getFilterName(i, filterName, this.filterOperand), filters[i].operand)
        }
      }
    }
    return params;
  }
  private mapSort(params: HttpParams, sort: SortParameters): HttpParams {
    if (sort.orderByField) {
      params = params.set(this.sortField, sort.orderByField)
        .set(this.sortAscending, sort.orderByAscending.toString())
    }
    return params;
  }
  private mapPagination(params: HttpParams, parameters: PageableParameters): HttpParams {
    return params.set(this.page, parameters.page.toString())
      .set(this.pageSize, parameters.pageSize.toString())
      .set(this.firstRequest, parameters.firstRequest.toString())
  }
  //Map to queryParams, for navigation
  public mapToQueryObjectPagination(params: PaginationParameters): object {
    let result = {};
    result = this.mapPaginationToQuery(result, params);
    if (params.sort) {
      result = this.mapSortToQuery(result, params.sort);
    }
    if (params.filters)
      result = this.mapFilterToQuery(result, params.filters);
    return result;
  }
  public mapToQueryObjectBookParams(params: BookParameters): object {
    let result = new BookParameters();
    result = this.mapPaginationToQuery(result, params);
    if(params.showAvailable){      
    result.showAvailable = params.showAvailable;
    }
    if(params.location){
      result.location = params.location;
    }
    if(params.genres){
      result.genres = params.genres; 
    }    
    console.log(result);
    return result;    
  }
  
  private mapPaginationToQuery(queryParams: any, pagination: PageableParameters): any {
    queryParams.page = pagination.page;
    queryParams.pageSize = pagination.pageSize;
    queryParams.firstRequest = pagination.firstRequest;
    return queryParams;
  }
  private mapFilterToQuery(queryParams: any, filters: FilterParameters[], filterName = this.filterName): any { 
    for (let i = 0; i < filters.length; i++) {
      if (filters[i].propertyName && filters[i].value) {
        queryParams[this.getFilterName(i, filterName, this.filterPropertyName)] = filters[i].propertyName;
        queryParams[this.getFilterName(i, filterName, this.filterValue)] = filters[i].value;

        if (filters[i].method) {
          queryParams[this.getFilterName(i, filterName, this.filterMethod)] = filters[i].method;
        }
        if (filters[i].operand) {
          queryParams[this.getFilterName(i, filterName, this.filterOperand)] = filters[i].operand;
        }
      }
    }
    return queryParams;
  }
  private mapSortToQuery(queryParams: any, sort: SortParameters): any {
    if (sort.orderByField && sort.orderByAscending) {
      queryParams[this.sortField] = sort.orderByField;
      queryParams[this.sortAscending] = sort.orderByAscending;
    }
    return queryParams;
  }

  //Map params from URL
  public mapFromqQueryToPaginationParams(params: any, defaultPage: number = 1, defultPageSize: number = 10, filterName = this.filterName): PaginationParameters {
    let p = new PaginationParameters;
    p.sort = new SortParameters;
    p.page = params.page ? +params.page : defaultPage;
    p.pageSize = params.pageSize ? +params.pageSize : defultPageSize;
    p.sort.orderByField = params[this.sortField] ? params[this.sortField] : null;
    p.sort.orderByAscending = params[this.sortAscending] ? params[this.sortAscending] : true;

    p.filters = this.mapFilterFromQuery(params, filterName);
    return p;
  }
  public mapFromqQueryToBookParams(params: any, defaultPage: number = 1, defultPageSize: number = 8): BookParameters {
    let book = new BookParameters;
    book.page = params.page ? +params.page : defaultPage;
    book.pageSize = params.pageSize ? +params.pageSize : defultPageSize;
    book.location = params.location ? +params.location : undefined;
    book.searchTerm = params.searchTerm ? params.searchTerm : undefined;
    book.showAvailable = typeof params.showAvailable === "undefined" ? undefined : JSON.parse(params.showAvailable);
    book.genres = params.genres ? params.genres : undefined;
    return book;
  }
  private mapFilterFromQuery(params: any, filterName: string): FilterParameters[] {
    let filterCount = 0;
    let filters = [];
    while (params[this.getFilterName(filterCount, filterName, this.filterPropertyName)] && params[this.getFilterName(filterCount, filterName, this.filterValue)]) {
      filters[filterCount] = new FilterParameters;
      filters[filterCount].propertyName = params[this.getFilterName(filterCount, filterName, this.filterPropertyName)]
      filters[filterCount].value = params[this.getFilterName(filterCount, filterName, this.filterValue)]
        ? params[this.getFilterName(filterCount, filterName, this.filterValue)]
        : null;
      if(params[this.getFilterName(filterCount, filterName, this.filterMethod)]){
        filters[filterCount].method = params[this.getFilterName(filterCount, filterName, this.filterMethod)];
      }
      if(params[this.getFilterName(filterCount, filterName, this.filterOperand)]){
        filters[filterCount].operand = params[this.getFilterName(filterCount, filterName, this.filterOperand)];
      }
      filterCount++;
    }
    return filters;
  }


  private getFilterName(index: number, name: string, property: string): string {
    return name + "[" + index + "]." + property;
  }

}*/