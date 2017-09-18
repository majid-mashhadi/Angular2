import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes, RouterLink, ActivatedRoute } from '@angular/router';
import { Http, Headers, RequestOptions } from '@angular/http';
import { NgModel } from '@angular/forms'

import { User, loginInterface } from './user';
import { HttPService } from '../services/http.service'
import { AlertConfig, AlertType } from '../Bootstrap/alert.config'
import { UserService } from '../Admin/users.service'

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/retrywhen';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/scan';
import { ISubscription } from 'rxjs/Subscription';

@Component({
    selector: 'login-user',
    templateUrl: './login.component.html',
    providers: [UserService]
})
export class LoginComponent implements OnInit {
    username: string = 'Test1@test.com';
    password: string = 'Test12!@';
    errorMessage: string = '';
    alertConfig: AlertConfig;
    subscription: ISubscription;
    retryAttempt: number = 3;

    ngOnInit() {
        let user: string = this.actvatedRoute.snapshot.params['user'];
    }

    constructor(private http: Http, private userService: UserService, private actvatedRoute: ActivatedRoute) {
        this.alertConfig = new AlertConfig(true, AlertType.danger, false);
    }

    login() {
        if (this.subscription) return;
        let headers = new Headers(
            { 'Content-Type': 'application/json' }
        );
        let options = new RequestOptions({ headers: headers });
        let user: User = new User();
        user.username = this.username;
        user.password = this.password;
        this.subscription = this.userService.login(user)
            .retryWhen((err) => {
                return err.scan((retryCount) => {
                    retryCount++;
                    if (retryCount < this.retryAttempt) {
                        this.updateMessage('Attempt #: ' + retryCount);
                        return retryCount;
                    }
                    else {
                        throw (err);
                    }
                }, 0).delay(2000)
            })
            //            .retry(this.retryAttempt)
            .subscribe(userResponse => {
                    sessionStorage.setItem["access_token"] = userResponse.access_token;
                    sessionStorage.setItem["userName"] = userResponse.userName;
                    console.log(sessionStorage.getItem["userName"]);
                    this.updateMessage('login successful.');
                    
                },
                error => {
                    this.subscription = undefined;
                    this.handleError(error);
                },
                () => {
                }
            );
    }

    onCancelRequest(): void {
        this.subscription.unsubscribe();
        this.updateMessage('Login request has been canceled');
    }

    updateMessage(msg: string) {
        this.errorMessage = msg || '';
        this.alertConfig.show = this.errorMessage != '';
    }

    successfull() {
        this.updateMessage('Registration successful.');
    }

    handleError(error: Response | any) {
        this.updateMessage(error._body);
    }

    closeAlert(reason: string) {
        this.updateMessage('');
    }


}