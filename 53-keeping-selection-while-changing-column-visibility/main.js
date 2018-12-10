var columnDefs = [
    {
        headerName: 'Make',
        field: 'make',
    },
    {
        headerName: 'Model',
        field: 'model',
    },
    {
        headerName: 'Price',
        field: 'price',
    },
];

var gridOptions = {
    columnDefs: columnDefs,
    defaultColDef: {
        width: 150,
    },
    rowData: [],
    sideBar: 'columns',
    enableRangeSelection: true,
    onRangeSelectionChanged: onRangeSelectionChanged,
    onColumnVisible: onColumnVisible,
};

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    fetch('https://api.myjson.com/bins/15psn9')
        .then(res => res.json())
        .then(data => gridOptions.api.setRowData(data))
        .catch(err => console.log(err))

});

let globalRangeSelection = [];

function onRangeSelectionChanged(params) {
    globalRangeSelection = params.api.getRangeSelections()[0];
}

function onColumnVisible(params) {
    let rowStart = globalRangeSelection.start.rowIndex;
    let rowEnd = globalRangeSelection.end.rowIndex;
    let allColumns = globalRangeSelection.columns
    let columnStart = allColumns[0];
    let columnEnd = allColumns[allColumns.length - 1];

    var rangeSelectionParams = { rowStart, rowEnd, columnStart, columnEnd };

    params.api.gridPanel.rangeController.setRange(rangeSelectionParams)
}

