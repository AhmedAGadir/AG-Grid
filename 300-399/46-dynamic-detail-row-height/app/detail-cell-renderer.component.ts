import { Component, ViewChild } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';

@Component({
  selector: 'app-detail-cell-renderer',
  template: `
  <div #wrapper style="background: blueviolet; color: white; padding: 10px;"> 
    <h1 style="margin: 0">My Custom Detail</h1>
    <ul style="margin: 0">
      <li 
        *ngFor="let fruit of fruits"
        >{{ fruit }}</li>
    </ul>
    </div>
  `,
})
export class DetailCellRenderer implements ICellRendererAngularComp {
  @ViewChild('wrapper') wrapper: ElementRef<HTMLDivElement>;
  fruits: string[];
  params: any;

  agInit(params: any): void {
    this.fruits = params.data.fruit;
    this.params = params;
  }


  refresh(params: any): boolean {
    console.log('refresh');
    return false;
  }
}
