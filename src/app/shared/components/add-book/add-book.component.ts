import { Component, OnInit } from "@angular/core";
import { IGenre } from "src/app/core/interfaces/genre";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IBook } from "src/app/core/interfaces/book";
import { BookService } from "src/app/core/services/book.service";

@Component({
  selector: "app-add-book",
  templateUrl: "./add-book.component.html",
  styleUrls: ["./add-book.component.scss"]
})
export class AddBookComponent implements OnInit {
  constructor(private bookService: BookService) {}

  userId: number = 1;

  genres: IGenre[] = [
    { name: "Fantazy" },
    { name: "Horror" },
    { name: "Science fiction" }
  ];

  addBookForm: FormGroup;

  ngOnInit(): void {
    this.AddBookForm();
  }

  AddBookForm() {
    this.addBookForm = new FormGroup({
      title: new FormControl(null, Validators.required),
      authors: new FormControl(null, Validators.required),
      genres: new FormControl(null, Validators.required),
      publisher: new FormControl(null)
    });
  }

  onSubmit() {
    const book: IBook = {
      name: this.addBookForm.get("title").value,
      authors: this.addBookForm.get("authors").value,
      genres: this.addBookForm.get("genres").value,
      available: true,
      userId: this.userId
    };

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
}
