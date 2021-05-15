import {User} from './user';

export interface LoginData{
    error: boolean;
    token: string;
    active_packages: string[];
    usertype: string;
    user: User;
    token_m: string;
}
