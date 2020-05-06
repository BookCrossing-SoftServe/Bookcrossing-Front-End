import { IRoomLocation } from './roomLocation';
import { IAuthor } from "src/app/core/models/author";
import { IGenre } from "src/app/core/models/genre";
export interface IBook {
  id?: number;
  name: string;
  userId: number;
  publisher?: string;
  available: boolean;
  authors: IAuthor[];
  genres: IGenre[];
  imagePath?: string;
  notice?: string;
  locations: IRoomLocation[];
}
