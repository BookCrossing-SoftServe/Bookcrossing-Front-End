import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { IBook } from 'src/app/core/models/book';
import { BookService } from 'src/app/core/services/book/book.service';
import { PaginationParameters } from "../../../core/models/Pagination/paginationParameters";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { PaginationService } from 'src/app/core/services/pagination/pagination.service';
import { BookParameters } from 'src/app/core/models/Pagination/bookParameters';
import { IGenre } from 'src/app/core/models/genre';
import { FilterParameters } from 'src/app/core/models/Pagination/FilterParameters';
import { ILocation } from 'src/app/core/models/location';
import { GenreService } from 'src/app/core/services/genre/genre';
import { LocationService } from 'src/app/core/services/location/location.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {

  books: IBook[];
  queryParams: BookParameters = new BookParameters;
  searchText: string;

  selectedLocation: number;
  loadedLocation: number;
  locations: ILocation[] = [];

  selectedGenres: string[];
  loadedGenres: string[];
  genres: IGenre[] = [];

  totalSize: number;

  showAvailableOnly: boolean = true;
  availableFilter: FilterParameters = { propertyName: "Available", value: true + '', method: "Equal" };


  constructor(private routeActive: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private genreService: GenreService,
    private locationService: LocationService,
    private paginationService: PaginationService,
  ) { }

  ngOnInit(): void {
    this.getAllGenres();
    this.getLocation();
    this.routeActive.queryParams.subscribe((params: Params) => {
      this.queryParams = this.paginationService.mapFromqQueryToBookParams(params, 1, 5)
      this.toggleAvailableFilter(this.queryParams.showAvailable)
      this.getBooks(this.queryParams);
    })
  }
  //Categories
  onCategoryOpened(isOpened: Boolean) {
    if (!isOpened && this.selectedGenres != this.loadedGenres) {
      this.loadedGenres = this.selectedGenres;
      this.addCategoryFilters(this.selectedGenres)
    }
  }
  resetCategories(): void {
    this.selectedGenres = [];
    this.loadedGenres = [];
    this.addCategoryFilters(this.selectedGenres)
  }
  addCategoryFilters(genreNames: string[]) {
    this.queryParams.genreFilters = [];
    for (let name of genreNames) {
      this.queryParams.genreFilters.push(<FilterParameters>{ propertyName: "Genre.Name", value: name });
    }
    this.resetPageIndex();
    this.changeUrl(this.queryParams);
  }

  //Locations
  onLocationOpened(isOpened: Boolean) {
    if (!isOpened && this.selectedLocation != this.loadedLocation) {
      this.loadedLocation = this.selectedLocation;
      this.addLocationFilter(this.selectedLocation)
    }
  }
  resetLocation(): void {
    this.selectedLocation = null;
    this.loadedLocation = null;
    this.addLocationFilter(this.selectedLocation)
  }
  addLocationFilter(locationId: number) {    
    this.queryParams.locationFilters = [];
    if(locationId){
      this.queryParams.locationFilters[0] = <FilterParameters>{ propertyName: "Location.Id", value: locationId + '', method: "Equal" };
    }    
    this.resetPageIndex();
    this.changeUrl(this.queryParams);
  }
  //Available
  toggleAvailable(checked : boolean) {
    this.queryParams.showAvailable = checked;
    this.resetPageIndex();
    this.changeUrl(this.queryParams);
  }
  toggleAvailableFilter(showAvailableOnly: boolean) {
    if (showAvailableOnly) {
      this.queryParams.bookFilters.push(this.availableFilter);
      this.queryParams.showAvailable = true;
    }
    else {
      if(this.queryParams.bookFilters?.length>1){
        this.queryParams.bookFilters = this.queryParams.bookFilters.filter(f => f.propertyName != this.availableFilter.propertyName);
      }
      else{
        this.queryParams.bookFilters = null;
      }
      this.queryParams.showAvailable = false;
    }
  }
  //Navigation
  resetPageIndex() : void {
    this.queryParams.page = 1;
    this.queryParams.firstRequest = true;
  }
  pageChanged(currentPage: number): void {
    this.queryParams.page = currentPage;
    this.queryParams.firstRequest = false;
    this.changeUrl(this.queryParams);
  }
  private changeUrl(params: BookParameters): void {
    this.router.navigate(['.'],
      {
        relativeTo: this.routeActive,
        queryParams: this.paginationService.mapToQueryObjectBookParams(params),
      });
  }


  //get
  getBooks(params: BookParameters): void {
    this.bookService.getBooksPage(params)
      .subscribe({
        next: pageData => {
          this.books = pageData.page;
          if (pageData.totalCount) {
            this.totalSize = pageData.totalCount;
          }
        },
        error: error => {
          alert("An error has occured, please try again");
        }
      });
  };
  getLocation() {
    this.locationService.getLocation().subscribe(
      (data) => {
        this.locations = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getAllGenres() {
    this.genreService.getGenre().subscribe(
      (data) => {
        this.genres = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  makeRequest(bookId: number): void {
    alert(bookId);
  }
}
