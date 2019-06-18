System.register(["ag-grid-community", "ag-grid-enterprise", "./styles.scss"], function (exports_1, context_1) {
    "use strict";
    var agGrid, gridOptions;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (agGrid_1) {
                agGrid = agGrid_1;
            },
            function (_1) {
            },
            function (_2) {
            }
        ],
        execute: function () {
            gridOptions = {
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
        }
    };
});
