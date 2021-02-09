import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const ROW_DATA = [
  {
    cId: '30',
    cdesc: 'save my comparision',
    cDate: '2021-01-26 10:56:32.0',
    'c Table': [
      {
        file_id: 131,
        PName: 'B1',
        PVersion: 'Ok2Ship (Final)',
        'Stage 1': {
          pId: 1,
          'p Num': 1,
          price: '15',
          'r price': '328',
          notes: null,
          'new price 2': 38.53333333333333,
          'new rprice': 21.866666666666667,
          primaryPhase: 'Y',
          'price 2': '150',
        },
        'Stage 2': {
          pId: 2,
          'p Num': 1,
          price: '25',
          'r price': '1328',
          notes: null,
          'new price 2': 63.12,
          'new rprice': 53.12,
          primaryPhase: 'Y',
          'price 2': '2000',
        },
        'Stage 3': {
          pId: 3,
          'p Num': 1,
          price: '64',
          'r price': '2328',
          notes: null,
          'new price 2': 40.28125,
          'new rprice': 36.375,
          primaryPhase: 'Y',
          'price 2': '257',
        },
        'Stage 4': {
          pId: 4,
          'p Num': 1,
          price: '25',
          'r price': '3328',
          notes: null,
          'new price 2': 143.12,
          'new rprice': 133.12,
          primaryPhase: 'Y',
          'price 2': '3578',
        },
        'Stage 5': {
          pId: 5,
          'p Num': 1,
          price: '35',
          'r price': '4328',
          notes: null,
          'new price 2': 130.8,
          'new rprice': 123.65714285714286,
          primaryPhase: 'Y',
          'price 2': '4578',
        },
      },
      {
        file_id: 132,
        PName: 'B2',
        'Stage 1': {
          pId: 1,
          'p Num': 1,
          price: '15',
          'r price': '328',
          notes: null,
          'new price 2': 38.53333333333333,
          'new rprice': 21.866666666666667,
          primaryPhase: 'Y',
          'price 2': '1000',
        },
        'Stage 2': {
          pId: 2,
          'p Num': 1,
          price: '25',
          'r price': '1328',
          notes: null,
          'new price 2': 63.12,
          'new rprice': 53.12,
          primaryPhase: 'Y',
          'price 2': '4000',
        },
        'Stage 3': {
          pId: 3,
          'p Num': 1,
          price: '64',
          'r price': '2328',
          notes: null,
          'new price 2': 40.28125,
          'new rprice': 36.375,
          primaryPhase: 'Y',
          'price 2': '2576',
        },
        'Stage 4': {
          pId: 4,
          'p Num': 1,
          price: '25',
          'r price': '3328',
          notes: null,
          'new price 2': 143.12,
          'new rprice': 133.12,
          primaryPhase: 'Y',
          'price 2': '3578',
        },
        'Stage 5': {
          pId: 5,
          'p Num': 1,
          price: '35',
          'r price': '4328',
          notes: null,
          'new price 2': 130.8,
          'new rprice': 123.65714285714286,
          primaryPhase: 'Y',
          'price 2': '4578',
        },
      },
      {
        file_id: 133,
        PName: 'B3',
        PVersion: 'OK2Scale (Post EVT)',
        'Stage 1': {
          pId: 1,
          'p Num': 1,
          price: '15',
          'r price': '328',
          notes: null,
          'new price 2': 38.53333333333333,
          'new rprice': 21.866666666666667,
          primaryPhase: 'Y',
          'price 2': '1000',
        },
        'Stage 2': {
          pId: 2,
          'p Num': 1,
          price: '25',
          'r price': '1328',
          notes: null,
          'new price 2': 63.12,
          'new rprice': 53.12,
          primaryPhase: 'Y',
          'price 2': '50',
        },
        'Stage 3': {
          pId: 3,
          'p Num': 1,
          price: '64',
          'r price': '2328',
          notes: null,
          'new price 2': 40.28125,
          'new rprice': 36.375,
          primaryPhase: 'Y',
          'price 2': '2000',
        },
        'Stage 4': {
          pId: 4,
          'p Num': 1,
          price: '25',
          'r price': '3328',
          notes: null,
          'new price 2': 143.12,
          'new rprice': 133.12,
          primaryPhase: 'Y',
          'price 2': '3578',
        },
        'Stage 5': {
          pId: 5,
          'p Num': 1,
          price: '35',
          'r price': '4328',
          notes: null,
          'new price 2': 130.8,
          'new rprice': 123.65714285714286,
          primaryPhase: 'Y',
          'price 2': '4578',
        },
      },
    ],
  },
];

@Component({
  selector: 'my-app',
  template: ` <div>
    <p>capex-chart works!</p>
    <div class="wrapper">
      <ag-grid-angular
        #agGrid
        style="width: 100%;"
        id="myGrid"
        class="ag-theme-alpine"
        [columnDefs]="columnDefs"
        [defaultColDef]="defaultColDef"
        [popupParent]="popupParent"
        [enableRangeSelection]="true"
        [enableCharts]="true"
        [chartThemeOverrides]="chartThemeOverrides"
        [rowData]="rowData"
        (firstDataRendered)="onFirstDataRendered($event)"
        (gridReady)="onGridReady($event)"
        [sideBar]="true"
      ></ag-grid-angular>
    </div>
    <div id="myChart" class="ag-theme-alpine my-chart"></div>
  </div>`,
})
export class AppComponent {
  gridApi;
  gridColumnApi;

  columnDefs;
  defaultColDef;
  popupParent;
  chartThemeOverrides;
  rowData: any;
  rowData1: any;
  options: any;

  constructor(private http: HttpClient) {
    // this.columnDefs = [
    //   {
    //     headerName: 'Program',
    //     field: 'PName',
    //     width: 150,
    //     chartDataType: 'category',
    //   },
    //   { field: 'Stage1Price', chartDataType: 'series' },
    //   { field: 'Stage2Price', chartDataType: 'series' },
    //   { field: 'Stage3Price', chartDataType: 'series' },
    // ];
    this.columnDefs = [
      {field: 'stage'}, 
      {field: 'b1'}, 
      {field: 'b2'}, 
      {field: 'b3'}
    ];
    this.defaultColDef = {
      editable: true,
      sortable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
      resizable: true,
      headerClass: 'first-row',
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
      aggFunc: 'sum'
    };
    this.popupParent = document.body;
    this.chartThemeOverrides = {
      common: {
        legend: { position: 'bottom' },
      },
      column: {
        axes: {
          category: {
            label: {
              rotation: 0,
            },
          },
        },
      },
    };
  }

  ngOnInit(): void {}

  onFirstDataRendered(params) {
    // debugger;
    var createRangeChartParams1 = {
      cellRange: {
        rowStartIndex: 0,
        rowEndIndex: 50,
        columns: [ 'stage', 'b1']
      },
      chartType: 'pie',
    };
    params.api.createRangeChart(createRangeChartParams1);

    var createRangeChartParams2 = {
      cellRange: {
        rowStartIndex: 0,
        rowEndIndex: 50,
        columns: [ 'stage', 'b2']
      },
      chartType: 'pie',
    };
    params.api.createRangeChart(createRangeChartParams2);

    var createRangeChartParams3 = {
      cellRange: {
        rowStartIndex: 0,
        rowEndIndex: 50,
        columns: [ 'stage', 'b3']
      },
      chartType: 'pie',
    };
    params.api.createRangeChart(createRangeChartParams3);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    // this.rowData1 = ROW_DATA;
    // this.rowData1.map((key) => {
    //   this.rowData = key['c Table'];
    //   this.rowData.map((item) => {
    //     item['Stage1Price'] = Number(item['Stage 1']['price 2']);
    //     item['Stage2Price'] = Number(item['Stage 2']['price 2']);
    //     item['Stage3Price'] = Number(item['Stage 3']['price 2']);
    //   });
    //   console.log('row', this.rowData);
    // });

    this.rowData = [
      {stage: 'StageOnePrice', b1: 150, b2: 1000, b3: 1000},
      {stage: 'StageTwoPrice', b1: 2000, b2: 4000, b3: 50},
      {stage: 'StageThreePrice', b1: 257, b2: 2576, b3: 2000},
    ]
  }
}
