"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var agGrid = __importStar(require("ag-grid-community"));
require("ag-grid-enterprise");
require("./styles/styles.scss");
var gridOptions = {
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete' },
        { headerName: 'Country', field: 'country' },
        { headerName: 'Sport', field: 'sport' },
        { headerName: 'Age', field: 'age' },
        { headerName: 'Year', field: 'year' },
        { headerName: 'Date', field: 'date' },
        { headerName: 'Gold', field: 'gold' },
        { headerName: 'Silver', field: 'silver' },
        { headerName: 'Bronze', field: 'bronze' },
        { headerName: 'Total', field: 'total' }
    ],
    defaultColDef: {
        width: 150,
        filter: true
    },
    rowData: null,
    onGridReady: function (params) { return params.api.sizeColumnsToFit(); },
    enableRangeSelection: true,
    rowSelection: 'multiple'
};
document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    agGrid.simpleHttpRequest({
        url: 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json',
    })
        .then(function (data) {
        agGrid.gridOptions.api.setRowData(data);
    });
});
