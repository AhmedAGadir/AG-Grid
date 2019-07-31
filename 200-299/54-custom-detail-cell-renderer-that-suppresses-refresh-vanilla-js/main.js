const store = {
    rowData: null
}

var columnDefs = [
    // group cell renderer needed for expand / collapse icons
    {field: 'name', cellRenderer: 'agGroupCellRenderer'},
    {field: 'account'},
    {field: 'calls'},
    {field: 'minutes', valueFormatter: "x.toLocaleString() + 'm'"}
];

var gridOptions = {
    columnDefs: columnDefs,
    masterDetail: true,
    enableCellChangeFlash: true,
    detailRowHeight: 260,
    detailCellRenderer: "myDetailCellRenderer",
    detailCellRendererParams: {
        suppressRefresh: true
    },
    components: {
        myDetailCellRenderer: DetailCellRenderer
    },
    onGridReady: function (params) {
        // arbitrarily expand a row for presentational purposes
        setTimeout(function () {
            var rowCount = 0;
            params.api.forEachNode(function (node) {
                node.setExpanded(rowCount++ === 0);
            });
        }, 500);

        setInterval(incrementCalls, 1000)
    },
    onFirstDataRendered(params) {
        params.api.sizeColumnsToFit();
    },
    rowData: store.rowData,
    getRowNodeId: data => data.account,
    deltaRowDataMode: true
};

function incrementCalls() {
    // For methods 1 and 2 see https://next.plnkr.co/edit/oGo70UnAImSiv9iS

    // METHOD 3) ** deltaRowDataMode + store ((DOES NOT WORK)) *** 
    let updatedRowData = store.rowData.map((row, ind) => ({
        ...row,
        callRecords: row.callRecords.map(cR => ({...cR})),
        calls: ind === 0 ? row.calls + 1 : row.calls
    }));
    store.rowData = updatedRowData;
    gridOptions.api.setRowData(store.rowData);
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    agGrid.simpleHttpRequest({url: 'https://raw.githubusercontent.com/ag-grid/ag-grid-docs/latest/src/javascript-grid-master-detail/custom-detail-with-grid/data/data.json'}).then(function (data) {
        store.rowData = data;
        gridOptions.api.setRowData(store.rowData);
    });
});