import {
    AfterViewInit,
    Component,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';

import { AgEditorComponent } from 'ag-grid-angular';
@Component({
    selector: 'textbox-renderer',
    template: `
    <input type="text" [(ngModel)]="params.value" /> <i></i>
`
})

export class TextBoxRenderer implements AgEditorComponent, AfterViewInit {
    public params: any;
       @ViewChild('input', { read: ViewContainerRef }) public input: any;
    agInit(params: any): void {
        console.log(params)
        this.params = params;
    }
    getValue() {
        return this.params.value;
    }

    refresh(params: any): boolean {
    
        return false;
    }
}