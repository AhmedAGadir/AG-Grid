import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServerSideRowModelModule } from '@ag-grid-enterprise/server-side-row-model';
import { SetFilterModule } from '@ag-grid-enterprise/set-filter';
import { MenuModule } from '@ag-grid-enterprise/menu';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-alpine-dark.css';
import { of } from 'rxjs';

@Component({
  selector: 'my-app',
  template: `<ag-grid-angular
    #agGrid
    style="width: 100%; height: 100%;"
    id="myGrid"
    class="ag-theme-alpine-dark"
    [modules]="modules"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [columnTypes]="columnTypes"
    [rowModelType]="rowModelType"
    [animateRows]="true"
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  ></ag-grid-angular>`,
})
export class AppComponent {
  private gridApi;
  private gridColumnApi;

  public modules: Module[] = [ServerSideRowModelModule, SetFilterModule, MenuModule];
  private columnDefs;
  private defaultColDef;
  private columnTypes;
  private rowModelType;
  private rowData: [];

  private fooMap

  constructor(private http: HttpClient) {
    this.fooMap = new Map([[1, 'Al'], [2, 'Bob'], [3, 'Libby']]);
    // function nameFormatter(params) {
    //   return fooMap.get(Number(params.value));
    // }
    this.columnDefs = [
      {
        field: 'name',
        headerName: 'Name',
        // tooltipValueGetter: nameFormatter,
        // valueFormatter: nameFormatter,
        filter: 'agSetColumnFilter',
        filterParams: {
          values: (params: any) => {
            params.success(Array.from(this.fooMap.values()));
          },
          // valueFormatter: nameFormatter,
          // textFormatter: (value: string | number) => {
          //   if (!isNaN(value as number)) { 
          //     return nameFormatter({ value });
          //   } else {
          //     return value;
          //   }
          // },
        },
      },
    ];
    this.defaultColDef = {
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true,
      menuTabs: ['filterMenuTab'],
    };
    this.columnTypes = { number: { filter: 'agNumberColumnFilter' } };
    this.rowModelType = 'serverSide';
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    console.log('data', [{'name': 1}, {'name': 2}, {'name': 3}]);

    of([{'name': 1}, {'name': 2}, {'name': 3}]).subscribe((data) => {
      var fakeServer = new FakeServer(data);
      var datasource = new ServerSideDatasource(fakeServer, this.fooMap);
      params.api.setServerSideDatasource(datasource);
    });
  }
}

function ServerSideDatasource(server, fooMap) {
  return {
    getRows: function (params) {
      console.log('[Datasource] - rows requested by grid: ', params.request);
      
      let isFiltering = Object.keys(params.request.filterModel).length > 0;
      if (isFiltering) {
        let filterValues = params.request.filterModel.name.values;
        let translatedFilterValues = [];
        fooMap.forEach((value, key) => {
          if (filterValues.includes(value)) {
            translatedFilterValues.push(key)
          }
        });
        let newFilterModel = {
          name: {
            filterType: 'set',
            values: translatedFilterValues
          }
        };
        params.request.filterModel = newFilterModel;
        console.log('newfilterModel', params.request.filterModel);
      }
      var response = server.getData(params.request);
      setTimeout(function () {
        if (response.success) {
          console.log('response rows', response.rows);
          let rowData = response.rows.map(({name}) => ({name: fooMap.get(Number(name))}));
          console.log('rowData', rowData);
          params.successCallback(rowData, response.lastRow);
        } else {
          params.failCallback();
        }
      }, 500);
    },
  };
}
