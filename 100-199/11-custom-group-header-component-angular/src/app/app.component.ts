import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {GridOptions} from 'ag-grid';
import {LicenseManager} from 'ag-grid-enterprise'
import {PivotHeaderComponent} from './pivot-header/pivot-header.component'

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  gridOptions: GridOptions = {
  pivotMode: true,
        toolPanelSuppressSideButtons: true,
      suppressPaginationPanel: true,
      columnDefs: [
    {headerName: "Country", field: "country", width: 120, rowGroup: true, enableRowGroup:true},
    {headerName: "Year", field: "year", width: 90, pivot: true, enablePivot:true},
    {headerName: "Date", field: "date", width: 110, pivot: true, enablePivot:true},
    {headerName: "Sport", field: "sport", width: 110},
    {headerName: "Gold", field: "gold", width: 100, aggFunc: 'sum'},
    {headerName: "Silver", field: "silver", width: 100, aggFunc: 'sum'},
    {headerName: "Bronze", field: "bronze", width: 100, aggFunc: 'sum'}
],
defaultColGroupDef: {
      children: [],
      headerGroupComponentFramework: PivotHeaderComponent as any
    }
  };

  constructor(private http: HttpClient) {
    LicenseManager.setLicenseKey('kazaz');
    this.getGridData();
  }

private getGridData() {
  this.http.get('https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json')
    .subscribe((result) => {
      this.gridOptions.api.setRowData(result as any);
    });
}
}
