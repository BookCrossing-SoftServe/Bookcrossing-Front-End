import { FilterParameters } from './FilterParameters';
import { PageableParameters } from './pageableParameters';

export class BookParameters extends PageableParameters {
  showAvailable : boolean = true;
  bookFilters : FilterParameters[];
  authorFilters : FilterParameters[];
  genreFilters : FilterParameters[];
  locationFilters : FilterParameters[];
}
