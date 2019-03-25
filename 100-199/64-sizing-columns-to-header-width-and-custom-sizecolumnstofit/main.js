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
    // autoSizing based on header widths
    gridOptions.columnApi.getAllDisplayedColumns().forEach((col, ind) => {
        let textWidth = document.querySelector(`.ag-header-row > .ag-header-cell:nth-of-type(${ind + 1}) > .ag-cell-label-container > .ag-header-cell-label > .ag-header-cell-text`).offsetWidth;
        let offset = 40;
        gridOptions.columnApi.setColumnWidth(col, textWidth + offset);
    })
}

function sizeColumnsToFit() {
    // custom sizeColumnsToFit
    let viewPortWidth = document.querySelector('.ag-header-viewport').offsetWidth
    let allDisplayedColumns = gridOptions.columnApi.getAllDisplayedColumns();
    allDisplayedColumns.forEach(col => {
        gridOptions.columnApi.setColumnWidth(col, Math.floor(viewPortWidth / allDisplayedColumns.length));
    });
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
