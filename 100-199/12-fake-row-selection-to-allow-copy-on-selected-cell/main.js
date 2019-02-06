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
    enableRangeSelection: true,
    // rowSelection: 'single',
    onCellClicked: params => {
        const currentlySelectedRow = document.querySelector('.ag-row-selected');
        if (currentlySelectedRow) {
            currentlySelectedRow.classList.remove('ag-row-selected');
        }
        params.event.path[1].classList.add('ag-row-selected');

        // if you want to dispatch a custom event 
        params.api.eventService.dispatchEvent({ type: 'customRowSelected', rowIndex: params.rowIndex });
    },
    onCustomRowSelected: params => {
        // can react to custom event here
        console.log(`row ${params.rowIndex} has been selected`);
    }

};

// setup the grid after the page has finished loading
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
