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
    getRowNodeId: data => data.account
};

function incrementCalls() {
    // METHOD 1) *** node.setRowData ((WORKS)) ***
    let firstNode = gridOptions.api.getRowNode(177000);
    firstNode.setDataValue('calls', firstNode.data.calls + 1);

    // METHOD 2) ** transaction updates ((DOES NOT WORK)) ***
    // let firstNodeData = gridOptions.api.getRowNode(177000).data
    // let updatedFirstNode = {
    //     ...firstNodeData,
    //     callRecords: firstNodeData.callRecords.map(record => ({...record})),
    //     calls: firstNodeData.calls + 1 
    // };
    // gridOptions.api.updateRowData({update: [updatedFirstNode]});  
    
    // For method 3 see https://next.plnkr.co/edit/qe2HPu7TiOc1JU4G 
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    agGrid.simpleHttpRequest({url: 'https://raw.githubusercontent.com/ag-grid/ag-grid-docs/latest/src/javascript-grid-master-detail/custom-detail-with-grid/data/data.json'}).then(function (data) {
        gridOptions.api.setRowData(data);
    });
});