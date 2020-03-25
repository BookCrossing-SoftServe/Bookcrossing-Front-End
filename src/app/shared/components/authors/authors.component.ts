import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {author} from "src/app/core/models/author";
import {Router} from '@angular/router';
import {AuthorService} from "src/app/core/services/author/authors.service";
import { $ } from 'protractor';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss']
})
export class AuthorsComponent implements OnInit {

  authors : author[];

  constructor(private router : Router, private authorService: AuthorService) { }
  ngOnInit() {
  // if(!window.localStorage.getItem('token')) {
  //   this.router.navigate(['login']);
  //    return;
  //  }
   this.authorService.getAuthors()
     .subscribe( authorData => {
       this.authors = authorData;
     });   
  }

  isReported(authorId : number){
    return authorId%2==0;
  }
  deleteAuthor(author: author): void {
    this.authorService.deleteAuthor(author.id)
      .subscribe( data => {
        this.authors = this.authors.filter(u => u !== author);
      })
  };

  editAuthor(author: author): void {
    window.localStorage.removeItem("editAuthorId");
    window.localStorage.setItem("editAuthorId", author.id.toString());
    this.router.navigate(['edit-author']);
  };

  addAuthor(): void {
    this.router.navigate(['add-author']);
  };
}
