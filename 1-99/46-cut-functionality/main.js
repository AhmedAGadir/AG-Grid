// This example does not include cutting selected rows/ranges with headers

var columnDefs = [
    { headerName: 'Athlete', field: 'athlete', width: 150 },
    { headerName: 'Age', field: 'age', width: 90 },
    { headerName: 'Country', field: 'country', width: 120 },
    { headerName: 'Year', field: 'year', width: 90 },
    { headerName: 'Date', field: 'date', width: 110 },
    { headerName: 'Sport', field: 'sport', width: 110 },
    { headerName: 'Gold', field: 'gold', width: 100 },
    { headerName: 'Silver', field: 'silver', width: 100 },
    { headerName: 'Bronze', field: 'bronze', width: 100 },
    { headerName: 'Total', field: 'total', width: 100 },
];

var gridOptions = {
    defaultColDef: {
        editable: true,
    },
    columnDefs: columnDefs,
    enableRangeSelection: true,
    rowSelection: 'multiple',
    getRowNodeId: data => data.id,
    getContextMenuItems: getContextMenuItems,
    allowContextMenuWithControlKey: true,
};

function getContextMenuItems(params) {
    var result = [
        {
            name: 'Cut Rows',
            action: cutSelectedRows,
            // shortcut: 'Ctrl+X',
        },
        {
            name: 'Cut Range',
            action: cutSelectedRange,
            // shortcut: 'Ctrl+X',
        },
        'copy'
    ];

    return result;
}

function cutSelectedRows() {
    gridOptions.api.copySelectedRowsToClipboard();
    let selectedRows = gridOptions.api.getSelectedRows();
    selectedRows.forEach((row, ind) => {
        Object.keys(row).forEach(field => {
            if (field === 'id') {
                return;
            }
            selectedRows[ind][field] = '';
        });
        gridOptions.api.getRowNode(row.id).setData(selectedRows[ind]);
    });
}

function cutSelectedRange() {
    gridOptions.api.copySelectedRangeToClipboard();
    let rangeSelection = gridOptions.api.getRangeSelections()[0];
    for (let rowInd = rangeSelection.start.rowIndex; rowInd <= rangeSelection.end.rowIndex; rowInd++) {
        let rowId = gridOptions.api.getDisplayedRowAtIndex(rowInd).id;
        rangeSelection.columns.forEach(col => {
            gridOptions.api.getRowNode(rowId).setDataValue(col.colDef.field, '')
        })
    }
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    var httpRequest = new XMLHttpRequest();
    httpRequest.open(
        'GET',
        'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json'
    );
    httpRequest.send();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var httpResult = JSON.parse(httpRequest.responseText);
            httpResult.forEach(obj => (obj.id = guidGenerator()));
            gridOptions.api.setRowData(httpResult);
        }
    };
});

function guidGenerator() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
        S4() +
        S4() +
        '-' +
        S4() +
        '-' +
        S4() +
        '-' +
        S4() +
        '-' +
        S4() +
        S4() +
        S4()
    );
}
