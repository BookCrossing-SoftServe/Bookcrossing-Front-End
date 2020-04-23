import { Component, OnInit } from '@angular/core';
import {GenreService} from '../../../core/services/genre/genre.service';
import {IGenre} from '../../../core/models/genre';

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.scss']
})
export class GenreComponent implements OnInit {

  constructor(private genreService: GenreService) { }

  genres: IGenre[];

  ngOnInit(): void {
    this.genreService.getGenres()
      .subscribe( genres_ => { this.genres = genres_; });
  }
}
