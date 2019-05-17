import { Component, ViewChild, ElementRef } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
  selector: "my-app-details",
  template: `
    <div >
      <h1 #myH1>This should be as high as h1 + img (&lt;- random height) is</h1>
      <img (load)="onImageLoaded()" src="https://lorempixel.com/1000/1000/abstract/" [height]="imgHeight">
    </div>
  `,
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements ICellRendererAngularComp {
  @ViewChild('myH1') myH1: ElementRef;
  public h1Height: number;
  public imgHeight = Math.random() * 1000;

  ngAfterViewInit() {
    this.h1Height = this.myH1.nativeElement.offsetHeight;
  }

  public agInit(params: any) {
    this.gridApi = params.api;
    this.node = params.node;
  }

  onImageLoaded() {
    this.node.setRowHeight(this.h1Height + this.imgHeight);
    this.gridApi.onRowHeightChanged();
  }
}
