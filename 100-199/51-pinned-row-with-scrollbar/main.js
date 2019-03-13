var columnDefs = [
    {
        headerName: 'Athlete',
        field: 'athlete',
        width: 150,
    },
    {
        headerName: 'Age',
        field: 'age',
        width: 90,
    },
    { headerName: 'Country', field: 'country', width: 120 },
    { headerName: 'Year', field: 'year', width: 90 },
    { headerName: 'Date', field: 'date', width: 110 },
    { headerName: 'Sport', field: 'sport', width: 110 }
];

var gridOptions = {
    defaultColDef: {
        sortable: true,
        filter: true,
        resizable: true,
        cellClass: params => params.node.rowPinned ? 'rowPinned' : null
    },
    columnDefs: columnDefs,
    rowData: null,
    getRowHeight: params => params.node.rowPinned ? 100 : 25,
    pinnedBottomRowData: getBottomPinnedRow(),
    onFirstDataRendered(params) {
        params.api.sizeColumnsToFit();
    },
};


function getBottomPinnedRow() {
    return [{
        athlete: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit quisquam eligendi unde itaque cum qui rerum nemo sapiente exercitationem, aperiam tenetur! Maiores velit id accusantium doloremque ipsum aut dicta sapiente.Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit quisquam eligendi unde itaque cum qui rerum nemo sapiente exercitationem, aperiam tenetur! Maiores velit id accusantium doloremque ipsum aut dicta sapiente.',
        age: 23,
        country: 'United States',
        year: 2008,
        date: '24/08/2008',
        sport: 'Swimming'
    }]
}


// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    // do http request to get our sample data - not using any framework to keep the example self contained.
    // you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json');
    httpRequest.send();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            var httpResult = JSON.parse(httpRequest.responseText);
            gridOptions.api.setRowData(httpResult);
        }
    };
});