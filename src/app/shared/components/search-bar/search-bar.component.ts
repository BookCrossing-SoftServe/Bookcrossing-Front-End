import { Component, OnInit } from '@angular/core';
import { BookParameters } from 'src/app/core/models/Pagination/bookParameters';
import { PaginationService } from 'src/app/core/services/pagination/pagination.service';
import { LanguageService } from 'src/app/core/services/language/language.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterParameters } from 'src/app/core/models/Pagination/FilterParameters';
import { SearchBarService } from 'src/app/core/services/searchBar/searchBar.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  searchQuery = {};
  searchTerm : string;
  
  constructor(  private routeActive: ActivatedRoute,
    private searchBarService: SearchBarService,
    private router: Router) { }  

  ngOnInit(): void {
    this.searchBarService.currentTerm.subscribe(term => {
      this.searchTerm = term;
     }
    )
  }
  clearInput(){
    setTimeout(() =>{      
    if(!this.router.url.startsWith("/books"))
    this.searchTerm = null;
  },100)
  }
  trimInput() {
    this.searchTerm = this.searchTerm.trim();
  }
  resertSearch() {
    this.searchTerm = null;    
    this.navigateToBooks(this.searchTerm);
  }
  navigateToBooks(name : string){
    this.router.navigate(['/books'],
    {
      relativeTo: this.routeActive,
      queryParams: {searchTerm: name},
      queryParamsHandling: 'merge'
    });
  }
}
