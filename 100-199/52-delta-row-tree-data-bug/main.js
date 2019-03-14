// specify the columns
var columnDefs = [
    { field: 'dateModified' },
    { field: 'size' }
];



var gridOptions = {
    defaultColDef: {
        sortable: true
    },
    columnDefs: columnDefs,
    treeData: true,
    // A) If we comment this and uncomment B, the sort fails
    rowData: [
        {
            id: 1,
            filePath: ["Documents"]
        }
    ],
    getDataPath: function (data) {
        return data.filePath;
    },
    getRowNodeId: function (data) {
        return data.id;
    },
    deltaRowDataMode: true,
    onGridReady: params => {
        // B) If we uncomment this and comment A, the sort fails
        // params.api.setRowData([
        //     {
        //         id: 1,
        //         filePath: ["Documents"]
        //     }
        // ]);
    }
};

// wait for the document to be loaded, otherwise
// ag-Grid will not find the div in the document.
document.addEventListener('DOMContentLoaded', function () {
    // lookup the container we want the Grid to use
    var eGridDiv = document.querySelector('#myGrid');

    // create the grid passing in the div to use together with the columns & data we want to use
    new agGrid.Grid(eGridDiv, gridOptions);
});