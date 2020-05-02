import { FilterParameters } from './FilterParameters';
import { PageableParameters } from './pageableParameters';

export class BookParameters extends PageableParameters {
  showAvailable? : boolean;
  searchTerm? : string;
  location? : number;
  genres? : number[];

  public getQueryObject(params: BookParameters): object {
    let result = new BookParameters();
    result = this.mapPaginationToQuery(result, params);
    result.searchTerm = params.searchTerm;
    if(params.showAvailable){      
    result.showAvailable = params.showAvailable;
    }
    if(params.location){
      result.location = params.location;
    }
    if(params.genres){
      result.genres = params.genres; 
    }    
    return result;    
  }
  public mapFromQuery(params: any, defaultPage: number = 1, defultPageSize: number = 8): BookParameters {
    let book = new BookParameters;
    book.page = params.page ? +params.page : defaultPage;
    book.pageSize = params.pageSize ? +params.pageSize : defultPageSize;
    book.location = params.location ? +params.location : undefined;
    book.searchTerm = params.searchTerm ? params.searchTerm : undefined;
    book.showAvailable = typeof params.showAvailable === "undefined" ? undefined : JSON.parse(params.showAvailable);
    book.genres = params.genres ? params.genres : undefined;
    return book;
  }
}
