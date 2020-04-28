import {Component, OnInit, ViewChild, Input} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {LanguageService} from "../../../core/services/language/language.service";
import {Language} from "../../../core/models/languages.enum";
import { BookParameters } from 'src/app/core/models/Pagination/bookParameters';
import { FilterParameters } from 'src/app/core/models/Pagination/FilterParameters';
import { PaginationService } from 'src/app/core/services/pagination/pagination.service';
import { Router, ActivatedRoute } from '@angular/router';
import { merge } from 'rxjs';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @ViewChild('menu', {static: false}) menu: any;
  languages: Language[];
  bookParams = new BookParameters;
  searchQuery = {};
  searchTerm : string;
  currentTerm : string;
  constructor(  private routeActive: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private paginationService : PaginationService,
    public languageService: LanguageService) { }  
  
  ngOnInit() {
    this.languages = this.languageService.languages;
  }
  resertSearch() {
    this.searchTerm = null;
    this.navigateToBooks(null);
  }
  navigateToBooks(name : string){
    if(this.currentTerm == name){
      return;
    }
    this.currentTerm = name;
    this.bookParams.page= 1;
    this.bookParams.pageSize = 8;
    this.bookParams.authorFilters = [];
    this.createFiltersForSearchTerm(name);
    this.router.navigate(['/books'],
    {
      relativeTo: this.routeActive,
      queryParams: this.paginationService.mapToQueryObjectBookParams(this.bookParams)
    });
  }
  private createFiltersForSearchTerm(term : string){
    if(term == null){
      return;
    }
    let temp = term.split(' ');
    this.bookParams.authorFilters[0] = <FilterParameters> {propertyName: "Book.Name", value: term}
    if(temp.length==1){
      this.bookParams.authorFilters[1] = <FilterParameters> {propertyName: "Author.LastName", value: temp[0]}
      this.bookParams.authorFilters[2] = <FilterParameters> {propertyName: "Author.FirstName", value: temp[0]}
    }else if(temp.length>1){
      this.bookParams.authorFilters[1] = <FilterParameters> {propertyName: "Author.FirstName", value: temp[0], operand: "And"}
      this.bookParams.authorFilters[2] = <FilterParameters> {propertyName: "Author.LastName", value: temp[temp.length-1]}
    }
  }
  changeLang(lang: Language): void {
    this.languageService.setLanguage(lang);
    this.translate.use(this.languageService.langToString(lang));
  }
}
