import { Component, ComponentFactoryResolver, OnInit, OnDestroy } from '@angular/core';
import { IBook } from 'src/app/core/models/book';
import { BookService } from 'src/app/core/services/book/book.service';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { PaginationService } from 'src/app/core/services/pagination/pagination.service';
import { BookParameters } from 'src/app/core/models/Pagination/bookParameters';
import { IGenre } from 'src/app/core/models/genre';
import { FilterParameters } from 'src/app/core/models/Pagination/FilterParameters';
import { ILocation } from 'src/app/core/models/location';
import { GenreService } from 'src/app/core/services/genre/genre';
import { LocationService } from 'src/app/core/services/location/location.service';
import { SearchBarService } from 'src/app/core/services/searchBar/searchBar.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit,OnDestroy {

  books: IBook[];
  queryParams: BookParameters = new BookParameters;

  locations: ILocation[] = [];

  selectedGenres: number[];
  loadedGenres: number[];
  genres: IGenre[] = [];

  totalSize: number;
  showAvailableOnly: boolean = true;


  constructor(private routeActive: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private genreService: GenreService,
    private locationService: LocationService,
    private searchBarService : SearchBarService,
  ) { }

  ngOnInit(): void {
    this.getAllGenres();
    this.getLocation();
    this.routeActive.queryParams.subscribe((params: Params) => {
      this.queryParams = this.queryParams.mapFromQuery(params, 1, 5)  
      if(this.queryParams.searchTerm){
        this.searchBarService.changeSearchTerm(this.queryParams.searchTerm)      
      }
      this.populateCategoriesFromQuery();
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
  addCategoryFilters(genreId: number[]) {
    this.queryParams.genres = genreId;
    this.resetPageIndex();
    this.changeUrl(this.queryParams);
  }
  private populateCategoriesFromQuery() {
    if(this.queryParams.genres){
      let genres: number[];
      if(Array.isArray(this.queryParams.genres))
       genres = this.queryParams.genres.map(v=>+v);
       else{
         genres = [+this.queryParams.genres];
       }
        this.selectedGenres =  genres;
        this.loadedGenres = genres;
    }
  }
  
  //Locations
  resetLocation(): void {
    this.queryParams.location = null;
    this.addLocation()
  }
  addLocation() {    
    this.resetPageIndex();
    this.changeUrl(this.queryParams);
  }

  //Available
  toggleAvailable(checked : boolean) {
    this.queryParams.showAvailable = checked;
    this.resetPageIndex();
    this.changeUrl(this.queryParams);
  }
  //Navigation
  pageChanged(currentPage: number): void {
    this.queryParams.page = currentPage;
    this.queryParams.firstRequest = false;
    this.changeUrl(this.queryParams);
  }
  private resetPageIndex() : void {
    this.queryParams.page = 1;
    this.queryParams.firstRequest = true;
  }
  private changeUrl(params: BookParameters): void {
    this.router.navigate(['.'],
      {
        relativeTo: this.routeActive,
        queryParams: this.queryParams.getQueryObject(params),
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

  ngOnDestroy(){
    this.searchBarService.changeSearchTerm(null)
  }
}
