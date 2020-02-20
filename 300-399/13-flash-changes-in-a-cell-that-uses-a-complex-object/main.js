var rowData = [
    {
        athlete: {
            name: 'Michael Phelps',
            bool: true
        },
        age: 23,
        id: 0
    }
]

var columnDefs = [
    {
        headerName: "athlete",
        valueGetter: params => params.data.athlete.bool,
        valueFormatter: params => params.data.athlete.name,
    },
    {field: 'age'}
];

var gridOptions = {
    columnDefs: columnDefs,
    rowData: rowData,
    getRowNodeId: data => data.id,
    enableCellChangeFlash: true
};

function update() {
    let updatedRows = [];
    gridOptions.api.forEachNode(node => {
        let updatedRow = {
            ...node.data,
            athlete: {
                name: node.data.athlete.name,
                bool: false
            },
            age: node.data.age + 1
        };
        updatedRows.push(updatedRow);
    });
    gridOptions.api.updateRowData({
        update: updatedRows
    });
}

document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
});

