import { IAuthor } from './author';
import {genre} from './genre';
export class book{
    id:number;
    name:string;
    userId:number;
    publisher:string;
    available:boolean;
    authors:IAuthor[];
    genres:genre[];


}