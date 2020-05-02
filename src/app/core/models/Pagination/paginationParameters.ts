import { FilterParameters } from './FilterParameters';
import { SortParameters } from './SortParameters';
import { PageableParameters } from './pageableParameters';

export class PaginationParameters extends PageableParameters {
  private filterName = "Filters";
  
  filters : FilterParameters[];
  sort : SortParameters;

  public mapFromQuery(params: any, defaultPage: number = 1, defultPageSize: number = 10, filterName = this.filterName): PaginationParameters {
    let p = new PaginationParameters;
    p.sort = new SortParameters;
    p.page = params.page ? +params.page : defaultPage;
    p.pageSize = params.pageSize ? +params.pageSize : defultPageSize;
    p.sort.orderByField = params.sort["Sort.OrderByField"] ? params.sort["Sort.OrderByField"] : null;
    p.sort.orderByAscending = params.sort["Sort.OrderByAscending"] ? params.sort["Sort.OrderByAscending"] : true;
    //p.sort = SortParameters.mapFromQuery(params.sort)
    p.filters = FilterParameters.mapFilterFromQuery(params, filterName);
    return p;
  }
  public getQueryObject(params: PaginationParameters): object {
    let result = {};
    result = this.mapPaginationToQuery(result, params);
    if (params.sort) {
      result = SortParameters.mapToQuery(result, params.sort);
    }
    if (params.filters)
      result = FilterParameters.mapFilterToQuery(result, params.filters,this.filterName);
    return result;
  }

}
