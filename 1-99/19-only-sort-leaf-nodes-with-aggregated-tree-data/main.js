// specify the columns
var columnDefs = [
    // we're using the auto group column by default!
    {
        headerName: 'Size',
        field: 'fileSize',
        valueFormatter: params => params.value + ' MB',
        cellStyle: params => {
            if (Object.keys(params.node.childrenMapped).length !== 0) {
                return { fontWeight: 'bold', color: 'mediumSlateBlue' };
            }
        },
        aggFunc: 'sum',
        comparator: (valA, valB, nodeA, nodeB, isInverted) => nodeA,
    },
];

// specify the data
var rowData = [
    { filePath: ['A', 'B', 'i'], fileSize: 24 },
    { filePath: ['A', 'B', 'ii'], fileSize: 18 },
    { filePath: ['A', 'B', 'iii'], fileSize: 2 },
    { filePath: ['C'] },
    { filePath: ['C', 'i'], fileSize: 10 },
    { filePath: ['C', 'ii'], fileSize: 14 },
    { filePath: ['D', 'i'], fileSize: 30 },
    { filePath: ['E', 'F', 'i'], fileSize: 25 },
    { filePath: ['E', 'F', 'ii'], fileSize: 15 },
    { filePath: ['E', 'F', 'iii'], fileSize: 10 },
    { filePath: ['E', 'F', 'G', 'i'], fileSize: 5 },
    { filePath: ['E', 'F', 'G', 'ii'], fileSize: 43 },
    { filePath: ['E', 'F', 'G', 'iii'], fileSize: 15 },
    { filePath: ['E', 'F', 'G', 'iv'], fileSize: 60 },
    { filePath: ['E', 'F', 'G', 'v'], fileSize: 90 },
    { filePath: ['H', 'I', 'i'], fileSize: 50 },
    { filePath: ['H', 'I', 'ii'], fileSize: 70 },
    { filePath: ['H', 'I', 'iii'], fileSize: 30 },
    { filePath: ['H', 'J', 'i'], fileSize: 23 },
    { filePath: ['H', 'J', 'ii'], fileSize: 34 },
    { filePath: ['H', 'J', 'iii'], fileSize: 87 },

];

var gridOptions = {
    columnDefs: columnDefs,
    rowData: rowData,
    treeData: true, // enable Tree Data mode
    animateRows: true,
    groupDefaultExpanded: -1, // expand all groups by default
    getDataPath: function (data) {
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
    multiSortKey: 'ctrl',
    postSort: sortLeaves,
};

function sortLeaves(rowNodes) {
    let sortModel = gridOptions.api.getSortModel();
    let fileSizeColIndex = sortModel.findIndex(col => col.colId === 'fileSize');

    if (fileSizeColIndex === -1) {
        return rowNodes;
    }

    let { colId, sort } = sortModel[fileSizeColIndex];
    rowNodes = rowNodes.sort((a, b) => {
        if (a.data === undefined) return a;
        if (b.data === undefined) return b
        if (sort === 'asc') return a.data[colId] - b.data[colId]
        if (sort === 'desc') return b.data[colId] - a.data[colId];
    });

}

document.addEventListener('DOMContentLoaded', function () {
    var eGridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(eGridDiv, gridOptions);
});
