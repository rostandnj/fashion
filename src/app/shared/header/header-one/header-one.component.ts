import {Component, OnInit, Input, HostListener, OnDestroy} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {GlobalService} from '../../services/globalService';
import {AuthService} from '../../services/auth-service';
import {Config} from '../../../config';
import {LoginModalService} from '../../services/login-modal-service';

@Component({
    selector: 'app-header-one',
    templateUrl: './header-one.component.html',
    styleUrls: ['./header-one.component.scss']
})
export class HeaderOneComponent implements OnInit, OnDestroy {

    @Input() class: string;
    @Input() themeLogo = 'assets/images/icon/logo.png'; // Default Logo
    @Input() topbar = true; // Default True
    @Input() sticky = false; // Default false

    public stick = false;

    frStatus: boolean;
    enStatus: boolean;
    currentLang = '';
    currentLangSubscription: Subscription;
    isLogin = false;
    isLoginSubscription: Subscription;
    userType = null;
    currentLogo  = '';
    currentLogoSubscription: Subscription;
    config = Config;

    constructor(private constantService: GlobalService, private authService: AuthService,
                private router: Router, private activatedRoute: ActivatedRoute, private loginModal: LoginModalService) {
        this.currentLangSubscription = this.constantService.currentLangSubject.subscribe((lang) => {
            this.currentLang = lang;
            this.frStatus = this.constantService.frStatus;
            this.enStatus = this.constantService.enStatus;

        }, (error) => {
            console.log(error);
        }, () => {

        });
        this.isLoginSubscription = this.authService.userIsLoginSubject.subscribe((status: boolean) => {
            this.isLogin = status;
            this.userType = this.authService.getUserType();
        }, (error) => {
            console.log(error);
        }, () => {

        });
    }

    ngOnInit(): void {
        this.currentLang = this.constantService.currentLang;
        this.frStatus = this.constantService.frStatus;
        this.enStatus = this.constantService.enStatus;
        this.authService.isLoggedIn();
        if (this.isLogin){
            //
            this.userType = this.authService.getUserType();
        }
    }

    // @HostListener Decorator
    @HostListener('window:scroll', [])
    onWindowScroll() {
        const num = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (num >= 150 && window.innerWidth > 400) {
            this.stick = true; } else {
            this.stick = false; }
    }

    onChangeLang(lang: string): void {

        this.constantService.changeLang(lang);
        this.frStatus = this.constantService.frStatus;
        this.enStatus = this.constantService.enStatus;
    }

    ngOnDestroy(): void {
        if (this.currentLangSubscription) {this.currentLangSubscription.unsubscribe(); }
        if (this.isLoginSubscription) {this.isLoginSubscription.unsubscribe(); }
        if (this.currentLogoSubscription) {this.currentLogoSubscription.unsubscribe(); }
    }

    logout(){
        this.authService.logout();
    }

    getUserType(){
        return this.authService.getUserType();
    }

    openModal(): void {
        this.loginModal.openOkDialog();
    }


}
