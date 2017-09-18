import { Injectable } from '@angular/core';

@Injectable()
export class AlertConfig {
    dismiss: boolean;
    type: string;
    show: boolean;
    constructor(dismiss: boolean, type: AlertType, show: boolean) {
        this.dismiss = dismiss;
        this.show = show;
        this.type = AlertType[type];
    }
}

export enum AlertType {
    danger,
    success,
    error,
    info,
    warning
}

export class Alert {
}