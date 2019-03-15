var gridOptions = {
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete' },
        { headerName: 'Country', field: 'country' },
        { headerName: 'Sport', field: 'sport' }
    ],
    defaultColDef: {
        width: 150,
    },
    rowData: null,
    sideBar: true,
    onColumnVisible: params => {
        console.log('onColumnVisible', params);
        if (params.columnApi.getAllDisplayedColumns().length === 0) {
            // custom event
            params.api.eventService.dispatchEvent({ type: 'allColumnsHidden', params: params });
        }
    },
    // if using vanillaJS
    onAllColumnsHidden: params => {
        console.log('onAllColumnsHidden', params);
        alert('No Columns');
    },
    // if using a framework
    onGridReady: params => {
        params.api.addEventListener('allColumnsHidden', params => {
            console.log('allColumnHidden', params);
            alert('No Columns');
        })
    }
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
