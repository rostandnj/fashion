import {Injectable} from '@angular/core';
import {ApiService} from './apiService';
import {Config} from '../../config';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import {LoginResponse} from '../classes/loginResponse';
import * as moment from 'moment';
import {User} from '../classes/user';
import {Subject} from 'rxjs';
import {Status} from '../classes/status';
import {ShopService} from './shopService';
import {LoginData} from '../classes/loginData';

@Injectable()
export class AuthService {

    isLogin: boolean;
    user: User;
    userSubject = new Subject<User>();
    tokenSubject = new Subject<string>();
    userIsLoginSubject = new Subject<boolean>();
    notifications: Status[];
    notificationsSubject = new Subject <Status[]>();

    emitUser() {
        this.userSubject.next(this.user);
    }

    emitNotifications() {
        this.notificationsSubject.next(this.notifications);
    }

    emitIsLogin() {
        this.userIsLoginSubject.next(this.isLogin);
    }

    constructor(private apiService: ApiService, private shopService: ShopService) {
        this.getUserStatus();
    }

    login(login: string, pass: string ) {
        return this.apiService.post(Config.login, {email: login, password: pass});
    }

    signUp(val ) {
        return this.apiService.post(Config.signup, val);
    }

    resetPassword(val) {
        return this.apiService.post(Config.reset, val);
    }

    setSession(authResult: LoginData) {
        const decoded = jwtDecode<JwtPayload>(authResult.token);
        // const expiresAt = moment().add(decoded.exp, 'second');

        localStorage.setItem('token', authResult.token);
        localStorage.setItem('token_m', authResult.token_m);
        localStorage.setItem('userType', authResult.usertype);
        localStorage.setItem('expires_at', String(decoded.exp) );
        this.user = authResult.user;
        this.isLogin = decoded.exp > moment().unix();
        if (this.isLogin){
            this.getUserNotifications();
            this.emitUser();
        }
        this.emitIsLogin();
    }

    decodeToken(token: string){
        const decoded = jwtDecode<JwtPayload>(token);
        console.log(decoded);
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('expires_at');
        localStorage.removeItem('token_m');
        localStorage.removeItem('cart');
        this.shopService.clearCart();
        this.isLogin = false;
        this.user = null;
        this.emitIsLogin();
        this.emitUser();
    }

    isLoggedIn() {
        this.isLogin = this.getExpiration() > moment().unix();
        if (this.isLogin){
            this.apiService.post(Config.userDetail, {}).subscribe((resUser: User) => {
                this.user = resUser;
                this.emitIsLogin();
                this.emitUser();

            }, (error => {
                return error;
            }));

        }else{
            this.emitIsLogin();
            this.emitUser();
        }
    }

    getLoginStatus(){
        return this.getExpiration() > moment().unix();
    }

    getExpiration() {
        const expiration = localStorage.getItem('expires_at');
        if (expiration !== null){
            return parseInt(expiration, 10);
        }
        else{
            return  0;
        }

    }

    getUserStatus(){
        this.isLogin = false;
        this.user = null;
        if (this.isLogin){
            this.apiService.post(Config.userDetail, {}).subscribe((resUser: User) => {
                this.user = resUser;
                this.emitIsLogin();
                this.emitUser();

            }, (error => {
                return error;
            }));

        }else{
            this.emitIsLogin();
            this.emitUser();
        }
    }

    activateAccount(token: string){
        return this.apiService.get(Config.activateAccount + token);
    }

    getUserType(){
        if (this.getExpiration() > moment().unix()){
            return localStorage.getItem('userType');
        }
        else{
            return null;
        }

    }

    public updateUser(user){
        this.user = user;
        this.emitUser();
    }

    getUserNotifications(){
        this.notifications = [];
        this.apiService.post(Config.userNotifications, {}).subscribe((res: Status[]) => {
            this.notifications = res;
            this.emitNotifications();

        }, (error) => {
            console.log(error);

        });
    }

    userMarkNotifications(){
        this.apiService.post(Config.userMarkNotifications, {}).subscribe((res) => {

        }, (error) => {
            console.log(error);

        });
    }

    getUserLastNotifications(data){
        this.apiService.post(Config.userNotificationsLast, data).subscribe((res: Status[]) => {
            if (this.notifications !== undefined){
                res.forEach((el) => {
                    this.notifications.push(el);
                });

            }
            this.emitNotifications();

        }, (error) => {
            console.log(error);

        });
    }


}
