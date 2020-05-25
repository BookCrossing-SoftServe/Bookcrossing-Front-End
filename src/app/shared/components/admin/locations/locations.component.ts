import {Component, ComponentFactoryResolver, OnInit, ViewChild} from '@angular/core';
import {RefDirective} from '../../../directives/ref.derictive';
import {ILocation} from '../../../../core/models/location';
import {CompletePaginationParams} from '../../../../core/models/Pagination/completePaginationParameters';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {LocationService} from '../../../../core/services/location/location.service';
import {FilterParameters} from '../../../../core/models/Pagination/filterParameters';
import {SortParameters} from '../../../../core/models/Pagination/sortParameters';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {
  locations: ILocation[];
  locationDisplayColumns: string[] = ['#', 'City', 'Street', 'Office Name'];
  locationProperties: string[] = ['id', 'city', 'street', 'officeName'];
  queryParams: CompletePaginationParams = new CompletePaginationParams();
  searchText: string;
  searchField = 'street';
  totalSize: number;
  showInactive = false;


  constructor(
    private routeActive: ActivatedRoute,
    private router: Router,
    private locationService: LocationService,
  ) { }


  ngOnInit() {
    this.queryParams.filters = [];
    this.routeActive.queryParams.subscribe((params: Params) => {
      this.queryParams = this.queryParams.mapFromQuery(params);
      this.queryParams.sort.orderByField = this.queryParams.sort.orderByField ? this.queryParams.sort.orderByField : 'id';
      this.searchText = this.queryParams?.filters[1]?.value;
      this.showInactive = this.queryParams?.filters[0]?.value === 'true';
      this.setInactiveFilter(this.showInactive);
      this.getLocations(this.queryParams);
    });
    this.onLocationSubmitted();
  }

  private onLocationSubmitted() {
    this.locationService.locationSubmited$.subscribe((location) => {
      const editedLocation = this.locations?.find((x) => x.id === location.id);
      if (editedLocation) {
        const index = this.locations?.indexOf(editedLocation);
        this.locations[index] = location;
        this.locations = this.locations.filter(x => x.isActive !== this.showInactive);
      } else {
        this.locations?.push(location);
      }
    });
  }

  toggleInactive() {
    this.queryParams.page = 1;
    this.showInactive = !this.showInactive;
    this.setInactiveFilter(this.showInactive);
    this.changeUrl();
  }
  private setInactiveFilter(showInactive: boolean) {
    this.queryParams.filters[0] = {propertyName: 'isActive', value: showInactive + '', method: 'NotEqual', operand: 'And'} as FilterParameters;
  }
  // Pagination/URL
  search(): void {
    if (this.queryParams?.filters[0]?.value === this.searchText) {
      return;
    }
    this.queryParams.page = 1;
    this.queryParams.filters[1] = {propertyName: this.searchField, value: this.searchText} as FilterParameters;
    this.changeUrl();
  }
  changeSort(selectedHeader: string) {
    this.queryParams.sort = {orderByField: selectedHeader, orderByAscending: !this.queryParams.sort.orderByAscending} as SortParameters;
    this.changeUrl();
  }
  pageChanged(currentPage: number): void {
    this.queryParams.page = currentPage;
    this.queryParams.firstRequest = false;
    this.changeUrl();
  }
  private changeUrl(): void {
    console.log(this.queryParams.getQueryObject());
    this.router.navigate(['.'],
      {
        relativeTo: this.routeActive,
        queryParams: this.queryParams.getQueryObject()
      });
  }

  AddLocation(): void {
    this.router.navigate(['admin/location-form']);
  }
  EditLocation(location: ILocation): void {
    this.router.navigate(['admin/location-form', location]);
  }
  // Get
  getLocations(params: CompletePaginationParams): void {
    this.locationService.getLocationsPage(params)
      .subscribe( {
        next: pageData => {
          this.locations = pageData.page;
          if (pageData.totalCount) {
            this.totalSize = pageData.totalCount;
          }
        },
        error: error => {
          alert('An error has occured, please try again');
        }
      });
  }
}
