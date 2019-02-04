var gridOptions = {
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete' },
        { headerName: 'Sport', field: 'sport' },
        {
            headerName: 'Age',
            field: 'age',
            pinnedRowCellRenderer: 'agAnimateShowChangeCellRenderer'
        },
        { headerName: 'Year', field: 'year' },
        { headerName: 'Date', field: 'date' },
        { headerName: 'Gold', field: 'gold' },
        { headerName: 'Silver', field: 'silver' },
        { headerName: 'Bronze', field: 'bronze' },
    ],
    rowData: null,
    getRowStyle: params => params.node.rowPinned ? { backgroundColor: 'khaki' } : null,
};

function updateAges() {
    [0, 1, 2, 3, 4].forEach(ind => {
        const pinnedNode = gridOptions.api.getPinnedTopRow(ind);
        pinnedNode.setDataValue('age', Math.random() < 0.5 ? pinnedNode.data.age + 1 : pinnedNode.data.age - 1);
    })
}

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    agGrid
        .simpleHttpRequest({
            url:
                'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json',
        })
        .then(function (data) {
            gridOptions.api.setPinnedTopRowData(data.slice(0, 5))
            gridOptions.api.setRowData(data.slice(5));
        });
});
