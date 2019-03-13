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
        editable: true
    },
    rowData: null,
    onCellEditingStarted: () => console.log('onCellEditingStarted'),
    onCellEditingStopped: () => console.log('onCellEditingStopped'),
    onGridReady: params => params.api.sizeColumnsToFit()
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

document.addEventListener('click', function (e) {
    let gridDiv = document.querySelector('#myGrid');
    if (gridDiv.contains(e.target) || gridOptions.api.getEditingCells().length === 0) {
        return;
    }
    gridOptions.api.stopEditing();
})
