var columnDefs = [
        {
        field: 'b', 
        cellClassRules: {
            'large': params => params.value > 6600,
            'medium': params => params.value > 3300 && params.value <= 6600,
            'small': params => params.value <= 3300
        }
    }
];

function createRowData() {
    var rowData = [];

    for (var i = 0; i<20; i++) {
        rowData.push({
            b: Math.floor( ( (i + 323) * 25435) % 10000),
        });
    }
    return rowData;
}


var gridOptions = {
    defaultColDef: {
        cellClass: 'align-right',
    },
    columnDefs: columnDefs,
    rowData: createRowData(),
    enableCellChangeFlash: true,
};

function onUpdateSomeValues() {
    var rowCount = gridOptions.api.getDisplayedRowCount();
    for (var i = 0; i<10; i++) {
        var row = Math.floor(Math.random() * rowCount);
        var rowNode = gridOptions.api.getDisplayedRowAtIndex(row);
        rowNode.setDataValue('b', Math.floor(Math.random() * 10000));
    }
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    gridOptions.api.sizeColumnsToFit();
});