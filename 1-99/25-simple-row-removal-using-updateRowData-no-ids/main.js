var gridOptions = {
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete' },
        { headerName: 'Sport', field: 'sport' },
        { headerName: 'Age', field: 'age' },
        { headerName: 'Remove Row', field: 'rowRemove', cellRenderer: 'removeButtonRenderer'}
    ],
    defaultColDef: {
        width: 150,
    },
    rowData: null,
    components: {
        removeButtonRenderer: removeButtonRenderer
    },
};

function removeButtonRenderer(params) {
    let button = document.createElement('button');
    button.textContent = 'remove';
    button.addEventListener('click', () => removeRow(params));
    return button
}

function removeRow(params) {
    params.api.updateRowData({remove: [params.node.data]})
}

document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    agGrid
        .simpleHttpRequest({
            url:
                'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json',
        })
        .then(function(data) {
            gridOptions.api.setRowData(data);
        });
});

