import { Component, OnInit, ViewChild, ElementRef, ComponentFactoryResolver } from '@angular/core';
import { IAuthor } from "src/app/core/models/author";
import {Router, ActivatedRoute, Params} from '@angular/router';
import {AuthorService} from "src/app/core/services/author/authors.service";
import { AuthorFormComponent } from '../author-form/author-form.component';
import { RefDirective } from '../../directives/ref.derictive';
import { PaginationParameters } from 'src/app/core/models/paginationParameters';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss']
})
export class AuthorsComponent implements OnInit {

  @ViewChild(RefDirective, {static: false}) refDir : RefDirective

  authors : IAuthor[];
  queryParams : PaginationParameters = new PaginationParameters();
  totalSize : number;  
  isReportTableToggled : boolean = false;

  constructor(private route : ActivatedRoute,private router : Router, private authorService: AuthorService, private resolver: ComponentFactoryResolver) { }


  ngOnInit() {
    this.route.queryParams.subscribe((params : Params) => {
      if(params.page){
        this.queryParams.page = +params.page;
      }
      if(params.searchQuery){
        this.queryParams.searchQuery = params.searchQuery;
      }
      this.queryParams.pageSize = 5;
      this.getAuthors(this.queryParams);
    })
  };

  //Pagination/URL
  search() : void{
    this.queryParams.page = 1;
    this.queryParams.firstRequest = true;
    this.changeUrl(this.queryParams);
  }
  pageChanged(currentPage : number) : void{      
      this.queryParams.page = currentPage;  
      this.changeUrl(this.queryParams);
  }
  private changeUrl(params : PaginationParameters)  : void{
    this.router.navigate(['.'], 
      {
        relativeTo: this.route, 
        queryParams: {page: params.page, searchQuery: params.searchQuery ? params.searchQuery : null},
        queryParamsHandling: 'merge',
      });
  }

  //Forms
  showAddForm()  {
    let newAuthor : IAuthor = {
      firstName: "",
      lastName: "",
      middleName: ""
    };
    this.showForm("Add Author",newAuthor)  
  };
  showEditForm(author : IAuthor,index : number){
    this.showForm("Edit Author",author,false,index)
  };
  private showForm(title : string, author : IAuthor, isNewAuthor : boolean = true, index? : number){    
    let formFactory = this.resolver.resolveComponentFactory(AuthorFormComponent);
    let instance = this.refDir.containerRef.createComponent(formFactory).instance;
    instance.title = title;
    instance.author = author;
    instance.isNewAuthor = isNewAuthor
    instance.onCancel.subscribe(()=> this.refDir.containerRef.clear());
    if(isNewAuthor)
      instance.onAction.subscribe(author => this.addAuthor(author));
    else    
      instance.onAction.subscribe(author => this.editAuthor(author,index));
  };

  //CRUD
  editAuthor(author: IAuthor, index : number): void {
    this.authorService.updateAuthor(author).subscribe({
      next: () => {
        this.authors[index] = author;
      },
      error: error => console.error(error)
    });
  };
  deleteAuthor(author: IAuthor): void {
    this.authorService.deleteAuthor(author.id)
      .subscribe({
        next: author => {
          this.authors = this.authors.filter(u => u !== author)
        },
        error: error => console.error(error)
      })
      this.authors = this.authors.filter(u => u !== author)
  };
  addAuthor(author: IAuthor): void {
    this.authorService.addAuthor(author).subscribe({
      next: author => {
        this.authors.unshift(author);
        console.log("Suc");
      },
      error: error => console.error(error)
    });
  };  
  getAuthors(params : PaginationParameters) : void {   
    this.authorService.getAuthorsPage(params)
    .subscribe( {
      next: pageData => {
      this.authors = pageData.page;
      this.totalSize = pageData.totalCount;
    },
    error: error => console.error(error)
   });   
  };
}
