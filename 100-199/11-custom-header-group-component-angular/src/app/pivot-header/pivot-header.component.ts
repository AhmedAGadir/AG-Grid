import { Component, ElementRef, HostBinding } from "@angular/core";
import {IHeaderGroupParams} from "ag-grid";
import {IHeaderGroupAngularComp} from "ag-grid-angular/main";

@Component({
  selector: "pivoted-header",
  templateUrl: "pivot-header.component.html"
})
export class PivotHeaderComponent implements IHeaderGroupAngularComp {
  value: string;

  constructor(private element: ElementRef) {}

  /**
   * The ag-grid init function. Runs automatically on grid startup
   * @param {IHeaderGroupParams} params - The ag-grid object that contains the column and the grid api
   * you can pass custom params on the params object
   */
  agInit(params: IHeaderGroupParams): void {
    /** 
    Use case example:
I want to add the column header name to each value, but since I’m using
a shared component to the grouped headers, I need to get the header name dynamically from the params.

The first grouped row should be prefixed with “Year.”
The second grouped row should be prefixed with “Date.”
I can access the original column defs by calling params.columnApi.getPivotColumns() but the problem is that I don’t know which column does this value belongs to.
    */
    let prefix;
    debugger;
    this.value = `${prefix} ${params.displayName}`;
  }
  
}
