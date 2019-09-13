let columnOrder = null;

var gridOptions = {
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete' },
        { headerName: 'Sport', field: 'sport' },
        { headerName: 'Age', field: 'age' },
        { headerName: 'Year', field: 'year' },
        { headerName: 'Date', field: 'date' },
        { headerName: 'Gold', field: 'gold' },
        { headerName: 'Silver', field: 'silver' },
        { headerName: 'Bronze', field: 'bronze' },
    ],
    defaultColDef: {
        width: 150,
    },
    rowData: null,
    onDragStarted: params => {
        console.log('[ON_DRAG_STARTED]')
        columnOrder = params.columnApi.columnController.allDisplayedColumns.map(col => col.colDef.field);
    },
    onDragStopped: params => {
        console.log('[ON_DRAG_STOPPED]');
        let newColumnOrder = params.columnApi.columnController.allDisplayedColumns.map(col => col.colDef.field);
        if (newColumnOrder.some((colId, ind) => columnOrder[ind] !== colId)) {
            console.log('A column has been moved');
            // execute logic
            columnOrder = newColumnOrder;
        } 

    },
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
