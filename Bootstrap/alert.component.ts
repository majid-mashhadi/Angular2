import { Component, Input, OnInit, OnChanges, Output, EventEmitter, ChangeDetectionStrategy,SimpleChange} from '@angular/core'
import { AlertConfig, AlertType } from './alert.config'

@Component({
    selector: 'alert',
    templateUrl: './alert.component.html'
})

export class AlertComponent implements OnChanges {

    @Input() config: AlertConfig;
    @Output() close: EventEmitter<string> = new EventEmitter<string>();

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        for (let propName in changes) {
            let changedProp = changes[propName];
            this.config = changedProp.currentValue;
        }
    }

    hide(): void {
        this.config.show = false;
        this.close.emit('');
    }
}

