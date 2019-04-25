var gridOptions = {
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete', width: 75 },
        { headerName: 'Country', field: 'country', width: 80 },
        { headerName: 'Gold', field: 'gold', width: 45, suppressMenu: true },
        { headerName: 'Silver', field: 'silver', width: 50, suppressMenu: true },
        { headerName: 'Bronze', field: 'bronze', width: 60, suppressMenu: true },
    ],
    defaultColDef: {
        width: 60
    },
    rowData: null,
};

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    agGrid
        .simpleHttpRequest({
            url:
                'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json',
        })
        .then(function (data) {
            gridOptions.api.setRowData(data);
        });
}); 
