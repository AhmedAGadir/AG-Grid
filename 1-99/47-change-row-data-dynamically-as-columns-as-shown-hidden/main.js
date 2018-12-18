var columnDefs = [
    {
        headerName: 'Make',
        field: 'make',
        hide: true
    },
    {
        headerName: 'Model',
        field: 'model',
        hide: true,
    },
    {
        headerName: 'Price',
        field: 'price',
        hide: true,
    },
];

var gridOptions = {
    columnDefs: columnDefs,
    defaultColDef: {
        width: 150,
    },
    rowData: [],
    getRowNodeId: data => data.id,
    sideBar: 'columns',
    onColumnVisible: onColumnVisible,
};

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    // set initial row data 
    fetch('./data.json')
        .then(res => res.json())
        .then(data => {
            let rowData = Object.keys(data).map(id => ({ id }))
            gridOptions.api.setRowData(rowData)
        })
        .catch(err => console.log(err))

});

function onColumnVisible(params) {
    if (params.visible) {
        appendColumnData('./data.json', params.column.colId)
    } else {
        removeColumnData(params.column.colId)
    }
}

function appendColumnData(url, field) {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            let rowData = Object.keys(data).map(id => ({
                ...gridOptions.api.getRowNode(id).data,
                [field]: data[id][field]
            }))
            gridOptions.api.setRowData(rowData)
        })
        .catch(err => console.log(err))
}

function removeColumnData(field) {
    let rowData = [];
    gridOptions.api.forEachNode(node => {
        let row = { ...node.data };
        delete row[field];
        rowData.push(row)
    })
    gridOptions.api.setRowData(rowData)
}
