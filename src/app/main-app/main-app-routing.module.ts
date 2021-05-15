import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainHomeComponent} from './main-home/main-home.component';
import {LoginRedirectComponent} from './login-redirect/login-redirect.component';


const routes: Routes = [
    {
        path: '',
        component: MainHomeComponent
    },
    {
        path: 'login/:token',
        component: LoginRedirectComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MainAppRoutingModule { }
