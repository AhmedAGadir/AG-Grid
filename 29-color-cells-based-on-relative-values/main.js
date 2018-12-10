let columnDefs = [
    {field: 'x'},
    {field: 'y'},
    {
        field: 'product',
        cellClassRules: {
            'red': params => params.value > 66,
            'amber': params => params.value > 33 && params.value <= 66,
            'green': params => params.value <= 33
        },
        valueGetter: params => params.data.x * params.data.y 
        
    }
];

let rowData = generateRowData();

function generateRowData() {
    let arr = [];
    for (let i = 0; i < 10; i++) {
        let obj = {};
        obj.x = Math.floor(Math.random() * 10) + 1;
        obj.y = Math.floor(Math.random() * 10) + 1;
        arr.push(obj)
    } 
    return arr;
}

let gridOptions = {
    columnDefs: columnDefs,
    defaultColDef: {
        editable: true
    },
    rowData: rowData,
};

let gridDiv = document.querySelector('#myGrid');
new agGrid.Grid(gridDiv, gridOptions);
