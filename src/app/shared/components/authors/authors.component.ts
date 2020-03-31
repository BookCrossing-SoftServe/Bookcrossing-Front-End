import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IAuthor } from "src/app/core/models/author";
import {Router} from '@angular/router';
import {AuthorService} from "src/app/core/services/author/authors.service";

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss']
})
export class AuthorsComponent implements OnInit {


  authors : IAuthor[];

  search : string = '';
  searchField : string = 'id';

  toggleEditIndex : number = -1;
  toggleNewAuthor : boolean = false;
  isReportTableToggled : boolean = false;

  editedAuthor : IAuthor;
  newAuthor : IAuthor = {
    id: 0,
    firstName: "",
    lastName: "",
    middleName: ""
  };

  constructor(private router : Router, private authorService: AuthorService) { }
  ngOnInit() {
   this.authorService.getAuthors()
     .subscribe( authorData => {
       this.authors = authorData;
     });   
  }



  toggleReportTable() : void {
    this.isReportTableToggled = !this.isReportTableToggled;
  }
  

  resetEditIndex() : void{
    this.toggleEditIndex = -1;
  }
  isEditActive(index : number) : boolean {
    return this.toggleEditIndex == index;
  }  

  toggleNew() : void{
    this.toggleNewAuthor = !this.toggleNewAuthor;
  }

  toggleEdit(index : number): void{
    if(this.toggleEditIndex == index)
      this.resetEditIndex()
    else
      this.toggleEditIndex = index;
      this.editedAuthor = Object.assign({},this.authors[index]);
  }

  editAuthor(author: IAuthor, index : number): void {
    this.authorService.updateAuthor(author).subscribe({
      next: () => {
        this.authors[index] = author;
        this.resetEditIndex();
        console.log("Suc");
      },
      error: error => console.error(error)
    });
  };
  deleteAuthor(author: IAuthor): void {
    this.authorService.deleteAuthor(author.id)
      .subscribe({
        next: author => {
          this.authors = this.authors.filter(u => u !== author)
          this.resetEditIndex();
          console.log("Suc");
        },
        error: error => console.error(error)
      })
      this.authors = this.authors.filter(u => u !== author)
  };
  addAuthor(author: IAuthor): void {
    this.authorService.addAuthor(author).subscribe({
      next: author => {
        this.authors.unshift(author);
        this.resetEditIndex();
        console.log("Suc");
      },
      error: error => console.error(error)
    });
  };
}
