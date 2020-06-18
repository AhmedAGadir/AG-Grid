import {
  AfterViewInit,
  Component,
  ViewChild,
  ViewContainerRef
} from "@angular/core";

import { ICellEditorAngularComp } from 'ag-grid-angular';

import { format } from "date-fns";

@Component({
  selector: "date-cell",
  template: `
    <mat-form-field>
      <input 
        matInput 
        [matDatepicker]="picker" 
        [value]="selectedDate" 
        (dateChange)="onDateChanged($event)" />
      <mat-datepicker-toggle 
        matSuffix 
        [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker 
        class="ag-custom-component-popup"
        panelClass="ag-custom-component-popup"
        #picker
        ></mat-datepicker>
    </mat-form-field>
  `,
})
export class MyDateEditor implements ICellEditorAngularComp {
  private params: any;
  private selectedDate = null;

  agInit(params: any): void {
    this.params = params;
  }

  getValue = () => {
    let dateString = null;
    if (this.selectedDate) {
      dateString = format(this.selectedDate, "dd/MM/yyyy");
    }
    return dateString;
  };

  afterGuiAttached = () => {
    if (!this.params.value) {
      return;
    }
    const [_, day, month, year] = this.params.value.match(
      /(\d{2})\/(\d{2})\/(\d{4})/
    );
    let selectedDate = new Date(year, month - 1, day);

    this.selectedDate = selectedDate;
  };

  onDateChanged = event => {
    let date = event.value;
    if (date) {
            date.setHours(0, 0, 0, 0);
        }
        this.selectedDate = date;
  }

  isPopup() {
    return true;
  }

}
