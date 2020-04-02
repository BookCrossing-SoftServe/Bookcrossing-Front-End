import { Book } from './book'
import { User } from './user'
export interface Request {
  id: number;
  book: Book;
  owner: User;
  user: User;
  requestDate: Date;
  receiveDate?: Date;
}
