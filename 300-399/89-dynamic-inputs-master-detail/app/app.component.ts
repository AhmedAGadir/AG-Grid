import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { MasterDetailModule } from '@ag-grid-enterprise/master-detail';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { ColumnsToolPanelModule } from '@ag-grid-enterprise/column-tool-panel';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-alpine.css';
import { DetailCellRenderer } from './detail-cell-renderer.component';
import { TextBoxRenderer } from './TextBoxRenderer.component';

@Component({
  selector: 'my-app',
  template: `Sample App<ag-grid-angular
      #agGrid
      style="width: 100%; height: 100%;"
      id="myGrid"
      class="ag-theme-alpine"
      [modules]="modules"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [masterDetail]="true"
      [detailCellRenderer]="detailCellRenderer"
      [detailCellRendererParams]="detailCellRendererParams"
      [detailRowHeight]="detailRowHeight"
      [groupDefaultExpanded]="groupDefaultExpanded"
      [frameworkComponents]="frameworkComponents"
      [rowData]="rowData"
      editType="fullRow"
      singleClickEdit="true"
      (firstDataRendered)="onFirstDataRendered($event)"
      (gridReady)="onGridReady($event)"
    ></ag-grid-angular>`,
})
export class AppComponent {
  public suppress = false;
  private gridApi;
  private gridColumnApi;

  public modules: Module[] = [
    ClientSideRowModelModule,
    MasterDetailModule,
    MenuModule,
    ColumnsToolPanelModule,
  ];
  private columnDefs;
  private defaultColDef;
  private detailCellRenderer;
  private detailRowHeight;
  private groupDefaultExpanded;
  private frameworkComponents;
  private rowData: [];

  constructor(private http: HttpClient) {
    this.columnDefs = [
      {
        field: 'name',
        cellRenderer: 'agGroupCellRenderer',
      },
      { field: 'account' },
      { field: 'calls' },
      {
        field: 'minutes',
        cellEditor: 'textBoxRenderer',
         editable: true,
      },
    ];
    this.defaultColDef = {
      flex: 1,
      suppressKeyboardEvent: this.suppressKeyboardEvent,
    };
    this.detailCellRenderer = 'myDetailCellRenderer';
    this.detailCellRendererParams = {
      getSuppress: this.getSuppress,
      setSuppress: this.setSuppress,
    };
    this.detailRowHeight = 70;
    this.groupDefaultExpanded = 1;
    this.frameworkComponents = {
      myDetailCellRenderer: DetailCellRenderer,
      textBoxRenderer: TextBoxRenderer,
    };
  }

  onFirstDataRendered(params) {
    params.api.forEachNode(function (node) {
      node.setExpanded(node.id === '1');
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.http
      .get('https://www.ag-grid.com/example-assets/master-detail-data.json')
      .subscribe((data) => {
        this.rowData = data;
      });
  }

  suppressKeyboardEvent = (params) => {
    if (this.suppress) {
      return true;
    }
    return false;
  };

  setSuppress = (bool) => {
    this.suppress = bool;
  };

  getSuppress = () => {
    return this.suppress;
  };
}
