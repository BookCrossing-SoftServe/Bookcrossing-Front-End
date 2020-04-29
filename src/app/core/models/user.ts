import {IRoomLocation} from './roomLocation';
import { IRole } from './role';
import { Role } from './role.enum';

export interface IUser {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  role: IRole;
  userLocation: IRoomLocation[];
  token?: string;
}
