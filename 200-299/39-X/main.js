var columnDefs = [
    {
        headerName: 'Athlete',
        field: 'athlete',
        width: 150,
        // pinnedRowCellRenderer: 'customPinnedRowRenderer',
        // pinnedRowCellRendererParams: {
        //     style: { color: 'blue' },
        // },
    },
    { headerName: 'Country', field: 'country', width: 120 },
    { headerName: 'Gold', field: 'gold', width: 90, valueGetter: pinnedRowValueGetter },
    { headerName: 'Silver', field: 'silver', width: 90, valueGetter: pinnedRowValueGetter },
    { headerName: 'Bronze', field: 'bronze', width: 90, valueGetter: pinnedRowValueGetter },
];

function pinnedRowValueGetter(params) {
    if (params.node.isRowPinned()) {
        let result;
        switch (params.data.athlete) {
            case 'Total':
                break;
            case 'Max':
                result = 'max';
                break;
            case 'Min':
                result = 'min';
                break;
            default:
                result = '-';
        }
        return result
    } else {
        return params.data[params.column.colId];
    }
}

var gridOptions = {
    defaultColDef: {
        sortable: true,
        filter: true,
        resizable: true,
    },
    columnDefs: columnDefs,
    rowData: null,
    getRowStyle: function(params) {
        if (params.node.rowPinned) {
            return { 'font-weight': 'bold' };
        }
    },
    pinnedBottomRowData: [createPinnedData('Total'), createPinnedData('Max'), createPinnedData('Min')],
    onFirstDataRendered(params) {
        params.api.sizeColumnsToFit();
    },
    components: {
        customPinnedRowRenderer: CustomPinnedRowRenderer,
    },
};

function createPinnedData(title) {
    return { athlete: title }
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    // do http request to get our sample data - not using any framework to keep the example self contained.
    // you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
    var httpRequest = new XMLHttpRequest();
    httpRequest.open(
        'GET',
        'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json'
    );
    httpRequest.send();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            var httpResult = JSON.parse(httpRequest.responseText);
            gridOptions.api.setRowData(httpResult.slice(0,30));
        }
    };
});
