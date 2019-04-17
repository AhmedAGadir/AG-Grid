import {Component} from "@angular/core";
import { FileUploader } from 'ng2-file-upload';
import {ICellRendererAngularComp} from "ag-grid-angular";

@Component({
    // selector: 'currency-cell',
    template: `
      <div 
        style="box-sizing: border-box;"
        [ngClass]="{
          'another-file-over-class': hasAnotherDropZoneOver,
          'hide-text': hideText
          }"
        ng2FileDrop
        (fileOver)="fileOverAnother($event)"
        (onFileDrop)="onFileDrop($event)"
        [uploader]="uploader">{{this.value}}</div>
    `,
    styles: [
        `.another-file-over-class { border: dotted 3px green; }`,
        `.hide-text {color: transparent}`
    ]
})
export class MyCellRenderer implements ICellRendererAngularComp {
    public params: any;
    private value;
    public uploader: FileUploader;
    public hasAnotherDropZoneOver:boolean = false;
    public hideText:boolean = false

    agInit(params: any): void {
        this.params = params;
        this.value = params.value ? params.value : '_hide_';
        this.uploader = new FileUploader({ url: 'not-used' });
        this.hideText = !params.value
    }

    refresh(): boolean {
        return false;
    }

    onFileDrop(e) {
      console.log(event)
    }

    public fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }
}
