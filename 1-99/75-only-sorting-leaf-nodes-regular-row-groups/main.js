// specify the columns
var columnDefs = [
    { field: 'level1', rowGroup: true, hide: true },
    { field: 'level2', rowGroup: true, hide: true },
    { field: 'level3', rowGroup: true, hide: true },
    {
        field: 'fileSize',
        valueFormatter: params => params.value + ' MB',
        cellStyle: params => {
            if (params.node.group) {
                return { fontWeight: 'bold', color: 'mediumSeaGreen' };
            }
        },
        aggFunc: 'sum',
        comparator: (valA, valB, nodeA, nodeB, isInverted) => nodeA,
    }
];

// specify the data
var rowData = [
    { level1: 'A', level2: 'B', fileName: 'i', fileSize: 24 },
    { level1: 'A', level2: 'B', fileName: 'ii', fileSize: 18 },
    { level1: 'A', level2: 'B', fileName: 'iii', fileSize: 2 },
    { level1: 'C', fileName: 'i', fileSize: 10 },
    { level1: 'C', fileName: 'ii', fileSize: 14 },
    { level1: 'D', fileName: 'i', fileSize: 30 },
    { level1: 'E', level2: 'F', fileName: 'i', fileSize: 25 },
    { level1: 'E', level2: 'F', fileName: 'ii', fileSize: 15 },
    { level1: 'E', level2: 'F', fileName: 'iii', fileSize: 10 },
    { level1: 'E', level2: 'F', level3: 'G', fileName: 'i', fileSize: 5 },
    { level1: 'E', level2: 'F', level3: 'G', fileName: 'ii', fileSize: 43 },
    { level1: 'E', level2: 'F', level3: 'G', fileName: 'iii', fileSize: 15 },
    { level1: 'E', level2: 'F', level3: 'G', fileName: 'iv', fileSize: 60 },
    { level1: 'E', level2: 'F', level3: 'G', fileName: 'v', fileSize: 90 },
    { level1: 'H', level2: 'I', fileName: 'i', fileSize: 50 },
    { level1: 'H', level2: 'I', fileName: 'ii', fileSize: 70 },
    { level1: 'H', level2: 'I', fileName: 'iii', fileSize: 30 },
    { level1: 'H', level2: 'J', fileName: 'i', fileSize: 23 },
    { level1: 'H', level2: 'J', fileName: 'ii', fileSize: 34 },
    { level1: 'H', level2: 'J', fileName: 'iii', fileSize: 87 },
];

var gridOptions = {
    columnDefs: columnDefs,
    rowData: rowData,
    animateRows: true,
    groupDefaultExpanded: -1, // expand all groups by default
    multiSortKey: 'ctrl',
    autoGroupColumnDef: {
        headerName: 'File Path',
        field: 'fileName',
        cellRendererParams: {
            suppressCount: true,
            padding: 20
        },
    },
    enableSorting: true,
    // onSortChanged: params => console.log('[onSortChanged]', params),
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
