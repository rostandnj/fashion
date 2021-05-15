import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {GlobalService} from '../../shared/services/globalService';
import {Subscription} from 'rxjs';
import {AuthService} from '../../shared/services/auth-service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-login-redirect',
  templateUrl: './login-redirect.component.html',
  styleUrls: ['./login-redirect.component.scss']
})
export class LoginRedirectComponent implements OnInit, AfterViewInit, OnDestroy  {
  isLogin: boolean;
  isLoginSubscription: Subscription;

  constructor(private globalService: GlobalService, private authService: AuthService, private route: ActivatedRoute) {
    this.isLoginSubscription = this.authService.userIsLoginSubject.subscribe((status: boolean) => {
      this.isLogin = status;
      if (this.isLogin){
        // 0=admin 10=owner 11=manager 20=client
        // this.userType = localStorage.getItem('userType');
      }

    }, (error) => {
      console.log(error);
    }, () => {

    });
  }

  ngAfterViewInit(): void {
    // this.openModal();
    if (!this.authService.getLoginStatus()){
    }
    this.authService.decodeToken( this.route.snapshot.paramMap.get('token'));
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (this.isLoginSubscription){
      this.isLoginSubscription.unsubscribe();
    }
  }

}
