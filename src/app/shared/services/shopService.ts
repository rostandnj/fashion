import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {ApiService} from './apiService';
import {Config} from '../../config';
import {Shop} from '../classes/shop';
import {Cart} from '../classes/cart';
import {CartItem} from '../classes/cartItem';
import {Product} from '../classes/product';

@Injectable({
    providedIn: 'root'
})
export class ShopService {
    articles: Product[];
    articlesSubject = new Subject<Product[]>();
    limit = 20;
    offset = 0;
    uLimit = 20;
    aLimit = 20;
    uOffset = 0;
    aOffset = 0;
    userOffset = 0;
    userLimit = 20;
    canLoadMore = false;
    canLoadMoreSubject = new Subject<boolean>();
    cart: Cart;
    cartSubject = new Subject<Cart>();
    constructor(private apiService: ApiService) {
        if (localStorage.getItem('cart') === null){
            this.cart = {items: [], totalPrice: 0, location: '', contact: ''};
        }
        else{
            this.cart = JSON.parse(localStorage.getItem('cart'));
        }
        // f
    }

    emitArticles() {
        this.articlesSubject.next(this.articles);
    }

    emitCart() {
        this.cartSubject.next(this.cart);
    }

    emitCanLoadMore(){
        this.canLoadMoreSubject.next(this.canLoadMore);
    }

    updateList(data: Product[]){
        this.offset = this.offset + this.limit;
        data.forEach((r) => {
            this.articles.push(r);
        });
        if (data.length >= this.limit){
            this.canLoadMore = true;
        }
        else{
            this.canLoadMore = false;
        }
        this.emitArticles();
        this.emitCanLoadMore();
    }

    getArticles() {
        this.offset = 0;
        this.apiService.post(Config.listArticles, {limit: this.limit, offset: this.offset}).subscribe((res: Product[]) => {
            this.articles = res;
            this.emitArticles();
            this.offset = this.offset + this.limit;
            if (res.length >= this.limit){
                this.canLoadMore = true;
            }else{
                this.canLoadMore = false;
            }
            this.emitCanLoadMore();

        }, (error => {
            return error;
        }));
    }

    getMoreArticles() {
        this.apiService.post(Config.listArticles, {limit: this.limit, offset: this.offset}).subscribe((res: Product[]) => {
            this.updateList(res);

        }, (error => {
            return error;
        }));
    }

    getCart(){
        return this.cart;
    }

    addItemToCart(item: CartItem){
        if (this.cart.items.length > 0){
            const first = this.cart.items[0];
            if (first.product.shop.id === item.product.shop.id){
                let test = false;
                this.cart.items.forEach((e) => {
                    if (e.product.id === item.product.id){
                        test = true;
                    }

                });
                if (test === false){
                    this.cart.items.push(item);
                    this.emitCart();
                    localStorage.setItem('cart', JSON.stringify(this.cart));
                }

            }else{
                this.cart.items = [];
                localStorage.removeItem('cart');
                this.cart.items.push(item);
                localStorage.setItem('cart', JSON.stringify(this.cart));

            }

        }
        else{
            this.cart.items = [];
            this.cart.items.push(item);
            localStorage.setItem('cart', JSON.stringify(this.cart));
        }
        this.emitCart();

    }

    removerItemToCart(id){
        if (this.cart.items.length > 0){
            let ind = null;
            this.cart.items.forEach((e, index ) => {
                if (e.product.id === id){
                    ind = index;
                }

            });
            if (ind !== null){
                this.cart.items.slice(ind, ind);
                localStorage.setItem('cart', JSON.stringify(this.cart));
            }

        }
        this.emitCart();
    }

    addItemQuantity(id){
        this.cart.items.forEach((e) => {
            if (e.product.id === id){
                e.quantity = e.quantity + 1;
                this.emitCart();
            }
        });
    }

    removeItemQuantity(id){
        this.cart.items.forEach((e) => {
            if (e.product.id === id){
                if (e.quantity > 1){
                    e.quantity = e.quantity - 1;
                    this.emitCart();
                }
            }
        });

    }

    clearCart(){
        this.cart.items = [];
        localStorage.removeItem('cart');
        this.emitCart();

    }
}
