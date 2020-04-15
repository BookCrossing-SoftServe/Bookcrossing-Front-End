import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { AuthorService } from "src/app/core/services/author/authors.service";
import { IAuthor } from "src/app/core/models/author";

@Component({
  selector: "app-view-authors",
  templateUrl: "./view-authors.component.html",
  styleUrls: ["./view-authors.component.scss"],
})
export class ViewAuthorsComponent implements OnInit {
  @Output() selectRow = new EventEmitter<IAuthor>();
  authors: IAuthor[] = [];
  searchField: string = "";

  constructor(private authorService: AuthorService) {}

  ngOnInit(): void {
    this.authorService.getAuthors().subscribe(
      (data) => {
        this.authors = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onSelectRow(author){
    this.selectRow.emit(author);
  }
}
