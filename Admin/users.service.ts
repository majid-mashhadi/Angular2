import { Injectable } from '@angular/core'
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { NewUser, User } from './user'
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/retrywhen';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/scan';
import { ISubscription} from 'rxjs/Subscription';


@Injectable()
export class UserService {
    registerURI: string;
    loginURI: string;

    constructor(private http: Http) {
        this.registerURI = '/account/register';
        this.loginURI = '/token';
    }

    login(user: User): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options: RequestOptions = new RequestOptions({ headers: headers });
        let loginData = 'grant_type=password&username=' + user.username + '&password=' + user.password;
        return this.http.post(this.loginURI, loginData, options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    }

    register(newUser: NewUser): Observable<User> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options: RequestOptions = new RequestOptions({ headers: headers });
        return this.http.post(this.registerURI, newUser, options)
            .map(this.extractData)
            .catch(this.handleErrorObservable);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body.data || {};
    }

    private handleErrorObservable(error: Response | any) {
        //   console.error(error.message || error);
        return Observable.throw(error.message || error);
    }

}


