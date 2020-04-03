import { Author } from './author';
import { Genre } from './genre';
export interface Book{
    id?:number;
    name:string;
    userId:number;
    publisher:string;
    available:boolean;
    authors:Author[];
    genres:Genre[];


}
