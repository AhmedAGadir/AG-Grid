import {
  AfterViewInit,
  Component,
  ViewChild,
  ViewContainerRef
} from "@angular/core";

import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: "make-editor",
  template: `
    <input value={{params.value}} />
  `,
})
export class MakeEditor implements ICellEditorAngularComp {
  private params: any;

  agInit(params: any): void {
    this.params = params;
  }

  getValue = () => {
    return this.params.value
  };

  isPopup() {
    return true;
  }

}
