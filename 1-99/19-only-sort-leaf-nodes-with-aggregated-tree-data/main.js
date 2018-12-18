// specify the columns
var columnDefs = [
    // we're using the auto group column by default!
    {
        field: 'size',
        valueFormatter: params => params.value + ' MB',
        cellStyle: params => {
            if (Object.keys(params.node.childrenMapped).length !== 0) {
                return {fontWeight: 'bold', color: 'mediumSlateBlue'};
            } 
        },
        aggFunc: 'sum',
        comparator: (valA, valB, nodeA, nodeB, isInverted) => nodeA,
    },
];

// specify the data
var rowData = [
    { filePath: ['A', 'B', 'i'], size: 24 },
    { filePath: ['A', 'B', 'ii'], size: 18 },
    { filePath: ['A', 'B', 'iii'], size: 2 },
    { filePath: ['C'] },
    { filePath: ['C', 'i'], size: 10 },
    { filePath: ['C', 'ii'], size: 14 },
    { filePath: ['D', 'i'], size: 30 },
    { filePath: ['E', 'F', 'i'], size: 25 },
    { filePath: ['E', 'F', 'ii'], size: 15 },
    { filePath: ['E', 'F', 'iii'], size: 10 },
    { filePath: ['E', 'F', 'G', 'i'], size: 5 },
    { filePath: ['E', 'F', 'G', 'ii'], size: 43 },
    { filePath: ['E', 'F', 'G', 'iii'], size: 15 },
    { filePath: ['E', 'F', 'G', 'iv'], size: 60 },
    { filePath: ['E', 'F', 'G', 'v'], size: 90 },
    { filePath: ['H','I','i'], size: 50 },
    { filePath: ['H','I','ii'], size: 70 },
    { filePath: ['H','I','iii'], size: 30 },
    { filePath: ['H','J','i'], size: 23 },
    { filePath: ['H','J','ii'], size: 34 },
    { filePath: ['H','J','iii'], size: 87 },

];

var gridOptions = {
    columnDefs: columnDefs,
    rowData: rowData,
    treeData: true, // enable Tree Data mode
    animateRows: true,
    groupDefaultExpanded: -1, // expand all groups by default
    getDataPath: function(data) {
        return data.filePath;
    },
    autoGroupColumnDef: {
        headerName: 'File Path',
        cellRendererParams: {
            suppressCount: true,
            padding: 20,
        },
    },
    enableSorting: true,
    postSort: sortLeaves,
};

function sortLeaves(rowNodes) {
    let sortModel = gridOptions.api.getSortModel();
    if (sortModel.length == 0) {
        return rowNodes;
    }
    let { colId, sort } = sortModel[0];
    rowNodes = rowNodes.sort((a, b) => {
        if (a.data === undefined ) return a;
        if (b.data === undefined ) return b
        if (sort === 'asc') return a.data[colId] - b.data[colId]
        if (sort === 'desc') return b.data[colId] - a.data[colId];
    });
}

document.addEventListener('DOMContentLoaded', function() {
    var eGridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(eGridDiv, gridOptions);
});
