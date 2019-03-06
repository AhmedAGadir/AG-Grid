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
        pinnedRowCellRenderer: 'customPinnedRowRenderer',

    },
    columnDefs: columnDefs,
    rowData: null,
    getRowStyle: function (params) {
        if (params.node.rowPinned) {
            return {
                fontWeight: 'bold',
                backgroundColor: '#f5f7f7',
                color: 'rgba(0, 0, 0, 0.164)'
                // color: 'rgba(0, 0, 0, 0.54)
            };
        }
    },
    pinnedTopRowData: createPinnedTopRow(),
    // onFirstDataRendered(params) {
    //     params.api.sizeColumnsToFit();
    // },
    components: {
        customPinnedRowRenderer: CustomPinnedRowRenderer
    },
    onSortChanged: params => {
        // console.log(params.api.getSortModel()[0])
        const pinnedRow = params.api.getPinnedTopRow(0);
        params.api.refreshCells({ rowNodes: [pinnedRow], force: true })
    }
};

function createPinnedTopRow() {
    var result = [{
        athlete: null,
        age: null,
        country: null,
        year: null,
        date: null,
        sport: null
    }];
    return result;
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