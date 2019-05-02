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
    },
];

// specify the data
var rowData = [
    { filePath: ['D', 'i'], fileSize: 24 },
    { filePath: ['D', 'E', 'ii'], fileSize: 18 },
    { filePath: ['D', 'E', 'iii'], fileSize: 2 },
    { filePath: ['D', 'ii'], fileSize: 18 },
    { filePath: ['D', 'iii'], fileSize: 2 },
    { filePath: ['A'], fileSize: 10},
    { filePath: ['B'], fileSize: 12},
    { filePath: ['C'], fileSize: 8}
]

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
        comparator: (valA, valB, nodeA, nodeB, isInverted) => {                        
           if (! nodeA.group && nodeB.group) return -1;
           if (! nodeA.group && ! nodeB.group ) {
               return nodeA.data.fileSize > nodeB.data.fileSize ? 1: -1;
           }
           return 1;
        }
    },
    defaultColDef: {
        sortable: true,
    },
    multiSortKey: 'ctrl',
};

document.addEventListener('DOMContentLoaded', function() {
    var eGridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(eGridDiv, gridOptions);
});
