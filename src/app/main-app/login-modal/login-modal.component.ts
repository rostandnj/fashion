import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, Input, AfterViewInit,
  Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../shared/services/auth-service';
import {LoginResponse} from '../../shared/classes/loginResponse';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {Config} from '../../config';
import {Subscription} from 'rxjs';
import {User} from '../../shared/classes/user';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('login_modal', { static: false }) NewsLetterModal: TemplateRef<any>;

  closeResult: string;
  modalOpen = false;
  loadingForm: boolean;
  formError = '';
  form3Error = '';
  form: FormGroup;
  form3: FormGroup;
  currentModal: BsModalRef;
  activeForm = 1;
  isLogin = false;
  config = Config;
  userIsLoginSubscription: Subscription;
  currentUser: User;
  userSubscription: Subscription;
  // tslint:disable-next-line:ban-types
  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private modalService: NgbModal, private authService: AuthService, private fb: FormBuilder) {
    this.currentUser = null;
    this.form = this.fb.group({
      email: ['', Validators.email],
      password: ['', Validators.required]
    });

    this.form3 = this.fb.group({
      email: ['', Validators.email]
    });

    this.userIsLoginSubscription = this.authService.userIsLoginSubject.subscribe((res: boolean) => {
      this.isLogin = res;
      this.loadingForm = false;

    }, (error) => {
      console.log(error);
    }, () => {

    });

    this.userSubscription = this.authService.userSubject.subscribe((res: User) => {
      this.currentUser = res;
      this.loadingForm = false;

    }, (error) => {
      console.log(error);
    }, () => {

    });
  }

  close() {
    this.currentModal.hide();
  }
  get f1() { return this.form.controls; }
  get f3() { return this.form3.controls; }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
     // this.openModal();
  }

  openModal() {
    if (isPlatformBrowser(this.platformId)) { // For SSR
      this.modalService.open(this.NewsLetterModal, {
        size: 'lg',
        ariaLabelledBy: 'Login',
        centered: true,
        windowClass: 'theme-modal newsletterm NewsLetterModal'
      }).result.then((result) => {
        this.modalOpen = true;
        this.currentModal = result;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnDestroy() {
    if (this.modalOpen){
      this.modalService.dismissAll();
    }
  }

  login() {
    this.loadingForm = true;
    this.formError = '';
    const val = this.form.value;

    if (val.email && val.password) {
      this.authService.login(val.email, val.password).subscribe((res: LoginResponse) => {
        this.authService.setSession(res.data);
        this.loadingForm = false;
        this.close();
      }, (error => {
        if (error.error.message !== undefined){
          this.formError = error.error.message;
        }else{
          this.formError = error.error;
        }
        this.loadingForm = false;
      }));
    }
  }

  activateLoginForm(){
    this.activeForm = 1;
  }
  activateResetForm(){
    this.activeForm = 3;
  }

  reset() {
    this.form3Error = '';
    const val = this.form3.value;
    this.loadingForm = true;
    this.authService.resetPassword(val).subscribe((res: string) => {
      this.loadingForm = false;
      // this.alertMsg = res;
      // this.alertStatus = true;
      this.activateLoginForm();
      this.form.reset();
      this.form3.reset();
      this.formError = '';
      this.form3Error = '';
    }, (error => {
      this.form3Error = error.error;
      this.loadingForm = false;
    }));
  }


}
