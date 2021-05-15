import {LoginData} from './loginData';

export interface LoginResponse {
    error: boolean;
    data: LoginData;
    token: string;
    usertype: string;
    restaurant_status: string;
}
