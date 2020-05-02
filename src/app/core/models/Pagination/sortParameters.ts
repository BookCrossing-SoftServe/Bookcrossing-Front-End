export class SortParameters {
  private static sortField = "Sort.OrderByField";
  private static sortAscending = "Sort.OrderByAscending";

  orderByField?: string;
  orderByAscending?: boolean = true;

  static mapFromQuery(sort: SortParameters): any {
    if(sort){
      sort.orderByField = sort[this.sortField] ? sort[this.sortField] : null;
      sort.orderByAscending = sort[this.sortAscending] ? sort[this.sortAscending] : true;
    }
    return sort;
  }
  static mapToQuery(queryParams: any, sort: SortParameters): any {
    if (sort.orderByField && sort.orderByAscending) {
      queryParams[this.sortField] = sort.orderByField;
      queryParams[this.sortAscending] = sort.orderByAscending;
    }
    return queryParams;
  }
}
