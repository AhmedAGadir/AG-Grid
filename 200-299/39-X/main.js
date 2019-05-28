var columnDefs = [
    {
        headerName: 'Athlete',
        field: 'athlete',
        width: 100,
        colSpan: getColSpan,
        cellStyle: getCellStyle
    },
    {
        headerName: 'Country',
        field: 'country',
        width: 100
    },
    {
        headerName: 'Gold',
        field: 'gold',
        width: 90,
        valueGetter: pinnedRowValueGetter,
        cellStyle: getCellStyle
    },
    {
        headerName: 'Silver',
        field: 'silver',
        width: 90,
        valueGetter: pinnedRowValueGetter,
        cellStyle: getCellStyle
    },
    {
        headerName: 'Bronze',
        field: 'bronze',
        width: 90,
        valueGetter: pinnedRowValueGetter,
        cellStyle: getCellStyle
    },
];

let allowRefresh = false;

function getColSpan(params) {
    return params.node.isRowPinned() ? 2 : 1;
}

function getCellStyle(params) {
    let rowPinned = params.node.isRowPinned();
    return {
        textAlign: typeof params.value === 'number' ? 'right' : rowPinned ? 'center' : null,
        letterSpacing: rowPinned ? '1px' : null,
    }
}

function pinnedRowValueGetter(params) {
    if (params.node.isRowPinned()) {

        if (!allowRefresh) {
            return;
        }
        debugger;

        let result;
        switch (params.data.athlete) {
            case 'Total':
                result = 2
                break;
            case 'Max':
                result = 4;
                break;
            case 'Min':
                result = 6;
                break;
            default:
                result = '-';
        }
        return result;
    } else {
        return params.data[params.column.colId];
    }
}

function refreshPinnedNodes(params) {
    let pinnedRowIndexes = [];
    params.api.forEachNode(node => {
        if (node.isRowPinned()) {
            pinnedRowIndexes.push(node.rowIndex);
        }
    });
    let pinnedNodes = pinnedRowIndexes.map(index => params.api.getRowNode(index));
    allowRefresh = true;
    params.api.refreshCells({ rowNodes: pinnedNodes })
    setTimeout(() => allowRefresh = false, 0)
}

function createPinnedData(title) {
    return { athlete: title }
}

var gridOptions = {
    defaultColDef: {
        sortable: true,
        filter: true,
        resizable: true,
    },
    columnDefs: columnDefs,
    rowData: null,
    pinnedBottomRowData: [createPinnedData('Total'), createPinnedData('Max'), createPinnedData('Min')],
    onFirstDataRendered: refreshPinnedNodes,
    components: {
        customPinnedRowRenderer: CustomPinnedRowRenderer,
    },
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
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
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            var httpResult = JSON.parse(httpRequest.responseText);
            gridOptions.api.setRowData(httpResult.slice(0, 30));
        }
    };
});
