import { Component, OnInit } from "@angular/core";
import { IGenre } from "src/app/core/models/genre";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IBook } from "src/app/core/models/book";
import { IAuthor } from "src/app/core/models/author";
import { BookService } from "src/app/core/services/book/book.service";
import { GenreService } from "src/app/core/services/genre/genre";
import { Observable } from "rxjs";
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: "app-add-book",
  templateUrl: "./add-book.component.html",
  styleUrls: ["./add-book.component.scss"],
})
export class AddBookComponent implements OnInit {
  constructor(
    private bookService: BookService,
    private genreService: GenreService
  ) {}
  addBookForm: FormGroup;
  authorControl: FormGroup;
  authorSearchControl = new FormControl();
  addNewAuthor: boolean = false;

  userId: number = 1;

  genres: IGenre[] = [];

  selectedAuthors: IAuthor[] = [];

  authors: IAuthor[] = [{ firstName: "aadad", lastName: "Pratchett" }, { firstName: "Terry", lastName: "Budget" }];

  filteredAuthors: Observable<IAuthor[]>;

  ngOnInit(): void {
    this.filteredAuthors = this.authorSearchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.buildForm();
    this.getAllGenres();
    console.log(this.filteredAuthors);
  }

  buildForm() {
    this.authorControl = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      middleName: new FormControl(null, Validators.required),
    });

    this.addBookForm = new FormGroup({
      title: new FormControl(null, Validators.required),
      genres: new FormControl(null, Validators.required),
      publisher: new FormControl(null),
    });
  }

  private _filter(value: string): IAuthor[] {
    // const filterValue = this._normalizeValue(value);
    const filterValue = value;
    console.log(filterValue);
    return this.authors.filter(
      (author) =>
        this._normalizeValue(author.firstName).includes(filterValue) ||
        this._normalizeValue(author.middleName).includes(filterValue) ||
        this._normalizeValue(author.lastName).includes(filterValue)
    );
  }

  private _normalizeValue(value: string): string {
    // console.log(value.toLowerCase().replace(/\s/g, ""));
    return value.toLowerCase().replace(/\s/g, "");
  }

  getAuthorString(author: IAuthor): string {
    return author.firstName + author.middleName + author.lastName;
  }

  onSubmit() {
    let genres: IGenre[] = [];
    for (let i = 0; i < this.addBookForm.get("genres").value?.length; i++) {
      const id = this.addBookForm.get("genres").value[i];
      genres.push({ id: id, name: this.getGenreById(id) });
    }
    const book: IBook = {
      name: this.addBookForm.get("title").value,
      authors: this.selectedAuthors,
      genres: genres,
      publisher: this.addBookForm.get("publisher").value,
      available: true,
      userId: this.userId,
    };
    this.bookService.postBook(book).subscribe(
      (data: IBook) => {
        alert("Successfully added");
      },
      (error) => {
        // alert(error);
        console.log(error);
        console.log(book);
      }
    );

    this.selectedAuthors = [];
    this.addBookForm.reset();
  }

  onAddAuthor() {
    const author: IAuthor = {
      firstName: this.authorControl.get("firstName").value,
      lastName: this.authorControl.get("lastName").value,
      middleName: this.authorControl.get("middleName").value,
    };

    this.addAuthor(author);
  }

  getGenreById(id: number) {
    return this.genres ? this.genres.find((genre) => genre.id == id)?.name : "";
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

  onDeleteAuthor(author: IAuthor) {
    const index = this.selectedAuthors.indexOf(author);
    if (index > -1) {
      this.selectedAuthors.splice(index, 1);
    }
  }

  addAuthor(author) {
    const index = this.selectedAuthors.findIndex((elem) => {
      return (
        elem.firstName.toLowerCase() === author.firstName.toLowerCase() &&
        elem.middleName.toLowerCase() === author.middleName.toLowerCase() &&
        elem.lastName.toLowerCase() === author.lastName.toLowerCase()
      );
    });
    if (index < 0) {
      this.selectedAuthors.push(author);
    }
  }
}
