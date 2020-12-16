import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { ExcelExportModule } from '@ag-grid-enterprise/excel-export';
import { RangeSelectionModule } from '@ag-grid-enterprise/range-selection';
import { ClipboardModule } from '@ag-grid-enterprise/clipboard';
import { GridChartsModule } from '@ag-grid-enterprise/charts';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-alpine.css';
import { ChildMessageRenderer } from './child-message-renderer.component';

@Component({
  selector: 'my-app',
  template: `<ag-grid-angular
    #agGrid
    style="width: 100%; height: 100%;"
    id="myGrid"
    class="ag-theme-alpine"
    [modules]="modules"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [enableRangeSelection]="true"
    [allowContextMenuWithControlKey]="true"
    [getContextMenuItems]="getContextMenuItems"
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
    [frameworkComponents]="frameworkComponents"
  ></ag-grid-angular> `,
})
export class AppComponent {
  private gridApi;
  private gridColumnApi;
  private frameworkComponents;

  public modules: Module[] = [
    ClientSideRowModelModule,
    MenuModule,
    ExcelExportModule,
    RangeSelectionModule,
    ClipboardModule,
    GridChartsModule,
  ];
  private columnDefs;
  private defaultColDef;
  private rowData: [];

  constructor(private http: HttpClient) {
    this.columnDefs = [
      {
        headerName: 'Child/Parent',
        field: 'value',
        cellRenderer: 'childMessageRenderer',
        cellEditor: 'childMessageRenderer',
        colId: 'xyz',
        editable: true,
        minWidth: 200,
      },
      {
        field: 'athlete',
        minWidth: 200,
      },
      { field: 'age' },
      {
        field: 'country',
        minWidth: 200,
      },
      { field: 'year' },
      {
        field: 'date',
        minWidth: 180,
      },
      {
        field: 'sport',
        minWidth: 200,
      },
      { field: 'gold' },
      { field: 'silver' },
      { field: 'bronze' },
      { field: 'total' },
    ];
    this.defaultColDef = {
      flex: 1,
      minWidth: 100,
      resizable: true,
      editable: true,
    };
    this.frameworkComponents = {
      childMessageRenderer: ChildMessageRenderer,
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.http
      .get(
        'https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/olympicWinners.json'
      )
      .subscribe((data) => {
        this.rowData = data.slice(0,10);
      });
  }

  getContextMenuItems(params) {
    if(params.column.colId === 'xyz'){
      return [];    
      // thought this would enable ctrl+ C and ctrl +V, but not the case
    }
    var result = [
      {
        name: 'Alert ' + params.value,
        action: function () {
          window.alert('Alerting about ' + params.value);
        },
        cssClasses: ['redFont', 'bold'],
      },
      {
        name: 'Always Disabled',
        disabled: true,
        tooltip:
          'Very long tooltip, did I mention that I am very long, well I am! Long!  Very Long!',
      },
      'separator',
      {
        name: 'Windows',
        shortcut: 'Alt + W',
        action: function () {
          console.log('Windows Item Selected');
        },
        icon: '<img src="../images/skills/windows.png"/>',
      },
      {
        name: 'Mac',
        shortcut: 'Alt + M',
        action: function () {
          console.log('Mac Item Selected');
        },
        icon: '<img src="../images/skills/mac.png"/>',
      },
      'separator',
      {
        name: 'Checked',
        checked: true,
        action: function () {
          console.log('Checked Selected');
        },
        icon: '<img src="../images/skills/mac.png"/>',
      },
      'copy',
      'separator',
      'chartRange',
    ];
    return result;
  }
}

function createFlagImg(flag) {
  return (
    '<img border="0" width="15" height="10" src="https://flags.fmcdn.net/data/flags/mini/' +
    flag +
    '.png"/>'
  );
}
