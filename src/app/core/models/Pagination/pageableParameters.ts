export class PageableParameters {
  page: number = 1;
  pageSize: number = 10;
  firstRequest?: boolean = true;

  public mapPaginationToQuery(queryParams: any, pagination: PageableParameters): any {
    queryParams.page = pagination.page;
    queryParams.pageSize = pagination.pageSize;
    queryParams.firstRequest = pagination.firstRequest;
    return queryParams;
    
  }
}