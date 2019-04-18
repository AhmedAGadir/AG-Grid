var gridOptions = {
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete', suppressToolPanel: true },
        { headerName: 'Country', field: 'country' },
        { headerName: 'Sport', field: 'sport' },
    ],
    defaultColDef: {
        width: 150,
    },
    rowData: null,
    sideBar: true

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
