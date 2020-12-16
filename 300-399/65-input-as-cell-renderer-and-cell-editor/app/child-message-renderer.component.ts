import {
  AfterViewInit,
  Component,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';

@Component({
  selector: 'child-cell',
  template: `<span><input #ipt [value]="inputVal" (input)="inputVal=$event.target.value"></span>`,
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

  ngAfterViewInit() {
    if (this.params.cellStartedEdit) {
      setTimeout(() => {
      this.ipt.element.nativeElement.focus();
      this.ipt.element.nativeElement.select();
      }, 0)
    }
  }

  agInit(params: any): void {
    // console.log('params', params);
    this.params = params;
    this.inputVal = params.value ? params.value : '';
  }

  getValue() {
    console.log(this.inputVal)
    return this.inputVal;
  }

  refresh(): boolean {
    return false;
  }
}