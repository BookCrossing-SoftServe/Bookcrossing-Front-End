import { Role } from './role';
import { RoomLocation } from './roomLocation';

export interface User {
    id : number;
    firstName : string;
    middleName : string;
    lastName : string;
    email : string;
    Role : Role;
    userLocacion : RoomLocation;
}