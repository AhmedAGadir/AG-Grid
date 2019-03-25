var gridOptions = {
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete' },
        { headerName: 'Country', field: 'country' },
        { headerName: 'Sport', field: 'sport' },
        { headerName: 'Age', field: 'age' },
        { headerName: 'Year', field: 'year' },
        { headerName: 'Date', field: 'date' },
        { headerName: 'Gold', field: 'gold', enableValue: true, aggFunc: 'sum' },
        { headerName: 'Silver', field: 'silver', enableValue: true, aggFunc: 'sum' },
        { headerName: 'Bronze', field: 'bronze', enableValue: true, aggFunc: 'sum' },
        { headerName: 'Total', field: 'total', enableValue: true, aggFunc: 'sum' }
    ],
    defaultColDef: {
        width: 150,
        resizable: true
    },
    rowData: null,
    sideBar: true,
    pivotMode: true
};

function autoSize() {
    gridOptions.columnApi.autoSizeAllColumns();
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
