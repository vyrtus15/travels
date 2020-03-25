import { RoleType } from '../../auth/interfaces/user.interface';

export interface UserItem {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;

    roles: RoleType[];
    createdOn: string;
}

export interface UsersResponse {
    items: UserItem[];
    total: number;
    limit: number;
    page: number;
}

export interface Mappedusers {
    items: UserItem[];
    total: number;
}
