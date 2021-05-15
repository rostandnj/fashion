import {Component, OnInit, Injectable, PLATFORM_ID, Inject, OnDestroy} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {Observable, Subscription} from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../classes/product';
import {GlobalService} from '../../services/globalService';
import {AuthService} from '../../services/auth-service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

  public products: Product[] = [];
  public search = false;
  public languages = [{
    name: 'English',
    code: 'en'
  }, {
    name: 'French',
    code: 'fr'
  }];

  public currencies = [{
    name: 'Euro',
    currency: 'EUR',
    price: 0.90 // price of euro
  }, {
    name: 'Rupees',
    currency: 'INR',
    price: 70.93 // price of inr
  }, {
    name: 'Pound',
    currency: 'GBP',
    price: 0.78 // price of euro
  }, {
    name: 'Dollar',
    currency: 'USD',
    price: 1 // price of usd
  }];

  frStatus: boolean;
  enStatus: boolean;
  currentLang = '';
  currentLangSubscription: Subscription;
  isLogin = false;
  isLoginSubscription: Subscription;
  userType = null;
  currentLogo  = '';
  currentLogoSubscription: Subscription;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private translate: TranslateService,
              public productService: ProductService, private constantService: GlobalService,
              private authService: AuthService,
              private router: Router, private activatedRoute: ActivatedRoute) {
    this.productService.cartItems.subscribe(response => this.products = response);
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

  searchToggle(){
    this.search = !this.search;
  }


  get getTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

  removeItem(product: any) {
    this.productService.removeCartItem(product);
  }

  changeCurrency(currency: any) {
    this.productService.Currency = currency;
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

}
