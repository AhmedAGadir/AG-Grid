import {
  AfterViewInit,
  Component,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';

@Component({
  selector: 'child-cell',
  template: `<span><input #ipt [value]="inputVal" (input)="onInput($event)"></span>`,
  styles: [
    ` .btn {
        line-height: 0.5;
      }
    `,
  ],
})
export class ChildMessageRenderer implements ICellRendererAngularComp, AfterViewInit {
  public params: any;
  private inputVal: string = '';
  @ViewChild('ipt', { read: ViewContainerRef }) public ipt;

  onInput(event) {
    this.inputVal = event.target.value;
    this.params.node.setDataValue(this.params.column.colId, this.inputVal);
  }

  ngAfterViewInit() {
    if (this.params.cellStartedEdit) {
      setTimeout(() => {
        this.ipt.element.nativeElement.focus();
        // this.ipt.element.nativeElement.select();
      }, 0)
    }
  }

  agInit(params: any): void {
    console.log('init')
    this.params = params;
    this.inputVal = params.value ? params.value : '';
  }

  getValue() {
    return this.inputVal;
  }

  refresh(params): boolean {
    this.params = params;
    this.inputVal = params.value ? params.value : '';
    return true;
  }
}