var gridOptions = {
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete' },
        { headerName: 'Country', field: 'country' },
        { headerName: 'Sport', field: 'sport' },
        { headerName: 'Age', field: 'age' },
        { headerName: 'Year', field: 'year' },
        { headerName: 'Date', field: 'date' },
        { headerName: 'Gold', field: 'gold' },
        { headerName: 'Silver', field: 'silver' },
        { headerName: 'Bronze', field: 'bronze' },
        { headerName: 'Total', field: 'total' }
    ],
    defaultColDef: {
        width: 150,
    },
    rowData: null,
    enableRangeSelection: true,
    rowSelection: 'multiple',
    onRangeSelectionChanged: params => {
        if (!params.finished) {
            return;
        }
        const { start, end, columns } = params.api.getRangeSelections()[0];
        if (start.rowIndex === end.rowIndex && columns.length === 1) {
            return;
        }
        const startIndex = start.rowIndex < end.rowIndex ? start.rowIndex : end.rowIndex;
        const endIndex = end.rowIndex > start.rowIndex ? end.rowIndex : start.rowIndex;
        params.api.forEachNode(node => {
            const isNodeInRangeSelection = node.rowIndex >= startIndex && node.rowIndex <= endIndex;
            node.setSelected(isNodeInRangeSelection);
        })
    }
};

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    agGrid
        .simpleHttpRequest({
            url:
                'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json',
        })
        .then(function (data) {
            gridOptions.api.setRowData(data.slice(0, 50));
        });
});
