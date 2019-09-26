const store = {
    rowData: null
};

var columnDefs = [
    { field: 'athlete', width: 150 },
    { field: 'age', width: 90 },
    { field: 'country', rowGroup: true, width: 120 },
    { field: 'year', width: 90 },
    { field: 'date', width: 110 },
    { field: 'sport', width: 110 },
    { field: 'gold', width: 100 },
    { field: 'silver', width: 100 },
    { field: 'bronze', width: 100 },
    { field: 'total', width: 100 },
];

var gridOptions = {
    columnDefs: columnDefs,
    rowData: store.rowData,
    deltaRowDataMode: true,
    getRowNodeId: data => data.id,
    groupDefaultExpanded: -1,
    getContextMenuItems: getContextMenuItems,
};

function getContextMenuItems(params) {
    if (params.node.group) {
        return [];
    }
    let groupingBy = params.columnApi.getRowGroupColumns().map(col => col.colId)[0];
    let allGroupValues = new Set();
    params.api.forEachNode(node => {
        if (node.group) {
            return;
        }
        allGroupValues.add(node.data[groupingBy]);
    });
    allGroupValues.delete(params.node.data[groupingBy]);
    let contextMenuItems = [...allGroupValues].map(value => ({
        name: 'Move to ' + value,
        action: function() {
            let updatedRows = store.rowData.map(row => ({
                ...row,
                country: row.id === params.node.data.id ? value : row.country
            }));
            store.rowData = updatedRows;
            params.api.setRowData(store.rowData);
        }
    }));
    return contextMenuItems;
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
            let idSequence = 0;
            let httpResult = JSON.parse(httpRequest.responseText);
            let rows = httpResult.slice(0,20).map(row => ({
                ...row,
                id: idSequence++
            }))
            store.rowData = rows;
            gridOptions.api.setRowData(store.rowData);
        }
    };
});
