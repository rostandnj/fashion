import {Injectable, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {CookieService} from 'ngx-cookie-service';
import { Config } from '../../config';
import {Subject, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {User} from '../classes/user';
import {isPlatformBrowser} from '@angular/common';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoginModalComponent} from '../../main-app/login-modal/login-modal.component';

@Injectable({
    providedIn: 'root',
})
export class LoginModalService implements OnDestroy{
    closeResult: string;
    modalOpen = false;
    currentModal: any;

    constructor(private translateService: TranslateService, private cookieService: CookieService, private router: Router,
                private modalService: NgbModal) {
    }
    ngOnDestroy() {
    }

    openModal() {
        this.modalService.open(LoginModalComponent, {
            size: 'lg',
            ariaLabelledBy: 'Login',
            centered: true,
            windowClass: 'theme-modal newsletterm NewsLetterModal'
        }).result.then((result) => {
            this.modalOpen = true;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
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

    public openOkDialog(): Promise<any> {
        return new Promise((resolve, reject) => {
            const ref = this.modalService.open(LoginModalComponent, {
                // Set up a handler before the dialog is dismissed to
                // resolve the promise.
                beforeDismiss: () => {
                    resolve();
                    // return true to close the dialog
                    return true;
                }
            });

            // Get the OkDialog from the NgbModal object
            this.currentModal = ref.componentInstance as LoginModalComponent;

            // Set the dialog's properties

            // Wire up the close event.  You will call this if you create
            // the 'x' close button, or if you add a cancel button, etc,
            // and it will close the dialog.
            this.currentModal.close = (result) => {
                ref.close();
                resolve();
            };
        });
    }

}
