import { Component, OnInit } from "@angular/core";
import { IGenre } from "src/app/core/interfaces/genre";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IBook } from "src/app/core/interfaces/book";
import { BookService } from "src/app/core/services/book.service";
import { IAuthor } from "src/app/core/interfaces/author";

@Component({
  selector: "app-add-book",
  templateUrl: "./add-book.component.html",
  styleUrls: ["./add-book.component.scss"]
})
export class AddBookComponent implements OnInit {
  constructor(private bookService: BookService) {}
  addBookForm: FormGroup;
  authorControl: FormGroup;

  userId: number = 1;

  genres: IGenre[] = [
    { id: 1, name: "Fantazy" },
    { id: 2, name: "Horror" },
    { id: 3, name: "Science fiction" }
  ];

  authors: IAuthor[] = [{ firstName: "sdasdad", lastName: "Tolkien" }];

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.authorControl = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      middleName: new FormControl(null, Validators.required)
    });

    this.addBookForm = new FormGroup({
      title: new FormControl(null, Validators.required),
      genres: new FormControl(null, Validators.required),
      publisher: new FormControl(null),
      author: this.authorControl
    });
  }

  onSubmit() {
    let genres: IGenre[] = [];
    for (let i = 0; i < this.addBookForm.get("genres").value.length; i++) {
      const id = this.addBookForm.get("genres").value[i];
      genres.push({ id: id, name: this.getGenreById(id) });
    }

    const book: IBook = {
      name: this.addBookForm.get("title").value,
      authors: this.addBookForm.get("authors").value,
      genres: this.addBookForm.get("genres").value,
      available: true,
      userId: this.userId
    };

    console.log(book);
    this.bookService.postBook(book).subscribe(
      (data: IBook) => {
        alert("Successfully added");
      },
      error => {
        alert(error.message);
        console.log(error);
      }
    );
  }

  onAddAuthor() {
    const author: IAuthor = {
      firstName: this.authorControl.get("firstName").value,
      lastName: this.authorControl.get("firstName").value,
      middleName: this.authorControl.get("firstName").value
    };
    this.authors.push(author);
  }

  getGenreById(id: number) {
    return this.genres ? this.genres.find(genre => genre.id == id)?.name : "";
  }

  onDeleteAuthor(author: IAuthor) {
    const index = this.authors.indexOf(author);
    if (index > -1) {
      this.authors.splice(index, 1);
    }
    console.log(this.authors);
  }
}
