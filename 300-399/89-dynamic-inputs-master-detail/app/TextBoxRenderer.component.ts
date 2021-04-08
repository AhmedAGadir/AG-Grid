import {
    AfterViewInit,
    Component,
    ViewChild,
    ViewContainerRef,
    ViewChild
} from '@angular/core';

import { AgEditorComponent } from 'ag-grid-angular';
@Component({
    selector: 'textbox-renderer',
    template: `
    <input type="text" #inputRef [(ngModel)]="params.value" /> <i></i>
`
})

export class TextBoxRenderer implements AgEditorComponent, AfterViewInit {
    public params: any;
    
    @ViewChild('inputRef') public input: any;

    agInit(params: any): void {
        console.log('agInit - textbooxrenderer')
        this.params = params;
    }
    getValue() {
        return this.params.value;
    }

    refresh(params: any): boolean {
        return false;
    }

    focusIn = () => {
        console.log('focusin', this.input);
       this.input.nativeElement.focus();
   }
}