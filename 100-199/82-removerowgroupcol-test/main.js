var gridOptions = {
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete' },
        { headerName: 'Sport', field: 'sport' },
        { headerName: 'Country', field: 'country', hide: true },
    ],
    defaultColDef: {
        width: 150,
    },
    rowData: null,
};

function setGroup() {
    gridOptions.columnApi.addRowGroupColumn('country');
}

function removeGroup() {
    gridOptions.columnApi.removeRowGroupColumn('country');
}

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
