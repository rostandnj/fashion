import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainHomeComponent } from './main-home/main-home.component';
import {MainAppRoutingModule} from './main-app-routing.module';

import {SharedModule} from '../shared/shared.module';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { LoginRedirectComponent } from './login-redirect/login-redirect.component';



@NgModule({
    declarations: [MainHomeComponent, LoginRedirectComponent,
    ],
    exports: [
    ],
    imports: [
        CommonModule,
        MainAppRoutingModule,
        SharedModule
    ]
})
export class MainAppModule { }
