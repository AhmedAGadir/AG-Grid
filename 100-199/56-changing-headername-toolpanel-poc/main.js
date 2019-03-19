var store = {
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete', colId: 'athlete' },
        { headerName: 'Country', field: 'country', colId: 'country' },
        { headerName: 'Sport', field: 'sport', colId: 'sport' },
    ],
}

var gridOptions = {
    columnDefs: store.columnDefs,
    defaultColDef: {
        width: 150,
    },
    rowData: null,
    onGridReady: params => params.api.sizeColumnsToFit(),
    sideBar: true,
    deltaColumnMode: true
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

function updateHeader() {
    store.columnDefs[0] = { headerName: 'Test', field: 'athlete', colId: 'athlete' };
    gridOptions.api.setColumnDefs(store.columnDefs);
    gridOptions.api.sizeColumnsToFit();
}