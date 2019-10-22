const FRUIT = ['apples', 'bananas', 'pineapples']

const store = {
    rowData: [
        { id: 0, quarter: 'Q1', apples: 1, bananas: 2, pineapples: 1 },
        { id: 1, quarter: 'Q2', apples: 3, bananas: 4, pineapples: 2 },
        { id: 2, quarter: 'Q3', apples: 0, bananas: 5, pineapples: 6 },
        { id: 3, quarter: 'Q4', apples: 3, bananas: 4, pineapples: 6 },
    ],
    columnDefs: [
        { field: "quarter", colId: 'quarter' },
        { field: "apples", colId: 'apples' },
        { field: "bananas", colId: 'bananas' },
        { field: "pineapples", colId: 'pineapples' },
    ]
}

var gridOptions = {
    defaultColDef: {
        sortable: true,
        resizable: true,
        width: 110
    },
    rowData: store.rowData,
    deltaRowDataMode: true,
    getRowNodeId: data => data.id,
    // set rowData to null or undefined to show loading panel by default
    columnDefs: store.columnDefs,
    deltaColumnMode: true,
    sideBar: true
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

});


let idSeq = 2344; // random number
function transpose() {
    let transposedRows = [];
    store.rowData.forEach(row => {
        let fruits = Object.keys(row).filter(key => FRUIT.includes(key) && row[key] !== 0);

        fruits.forEach(fruit => {
            transposedRows.push({
                quarter: row.quarter,
                fruit: fruit,
                sum: row[fruit],
                id: idSeq++
            });
        });
    })

    store.rowData = transposedRows;
    gridOptions.api.setRowData(store.rowData)

    let updatedColumnDefs = [
        { field: "quarter", colId: 'quarter', enableRowGroup: true, enableValue: true, enablePivot: true },
        { field: 'fruit', colId: 'fruit', enableRowGroup: true, enableValue: true, enablePivot: true },
        { field: 'sum', colId: 'sum', enableRowGroup: true, enableValue: true, enablePivot: true },
    ];
    store.columnDefs = updatedColumnDefs;
    gridOptions.api.setColumnDefs(updatedColumnDefs);

    document.querySelector('button').disabled = true;
}