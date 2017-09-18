import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes, RouterLink } from '@angular/router';
import { Http, Headers, RequestOptions } from '@angular/http';
import { NgModel } from '@angular/forms'

import { NewUser } from './user';
import { HttPService } from '../services/http.service'
import { AlertConfig, AlertType } from '../Bootstrap/alert.config'
import { UserService } from '../Admin/users.service'

@Component({
    selector: 'register-user',
    templateUrl: './register.component.html',
    providers: [UserService]
})

export class RegisterUserComponent {

    registerURI: string = '';
    email: string = '';
    password: string = '';
    confirmPassword: string = '';
    errorMessage: string = '';
    service: HttPService<NewUser>;
    alertConfig: AlertConfig;

    constructor(private http: Http, private userService: UserService) {
        this.alertConfig = new AlertConfig(true, AlertType.danger, false);
        this.registerURI = '/api/account/register';
    }

    registerUser() {
        let headers = new Headers(
            { 'Content-Type': 'application/json' }
        );
        let options = new RequestOptions({ headers: headers });
        let newUser: NewUser = new NewUser();
        newUser.email = this.email;
        newUser.password = this.password;
        newUser.confirmPassword = this.confirmPassword;

        this.userService.register(newUser).subscribe(user => {
            console.log(user);
                this.updateMessage('Registration successful.');
            },
            error => {
                this.handleError(error);
            }
        );
    }

    updateMessage(msg: string) {
        this.errorMessage = msg || '';
        this.alertConfig.show = msg.trim() != '';
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

    cancel() {
        this.updateMessage("registeration canceled");
    }

}