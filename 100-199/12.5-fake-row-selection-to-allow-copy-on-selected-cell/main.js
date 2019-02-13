var gridOptions = {
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete', pinned: 'left' },
        { headerName: 'Sport', field: 'sport' },
        { headerName: 'Age', field: 'age' },
        { headerName: 'Year', field: 'year' },
        { headerName: 'Date', field: 'date' },
        { headerName: 'Gold', field: 'gold' },
        { headerName: 'Silver', field: 'silver' },
        { headerName: 'Bronze', field: 'bronze', pinned: 'right' },
    ],
    defaultColDef: {
        width: 150,
    },
    rowData: null,
    enableRangeSelection: true,
    // rowSelection: 'single',
    // suppressRowClickSelection: true,
    onRowSelected: params => {
        if (params.node.selected) {
            unhighlightOtherNodes(params.rowIndex)
        }
    },
    onCellClicked: params => {
        unhighlightOtherNodes(params.rowIndex)
        params.api.getSelectedNodes().forEach(node => node.setSelected(false));
        [...document.querySelectorAll(`[row-index='${params.rowIndex}']`)].forEach(node => node.classList.add('ag-row-selected'));
    },
    onGridReady: params => {
        params.api.sizeColumnsToFit();
    },
};

function selectFirstRow() {
    gridOptions.api.getRowNode(0).setSelected(true);
}

function unhighlightOtherNodes(rowIndex) {
    const highlightedNodes = document.querySelectorAll('.ag-row-selected');
    for (const node of highlightedNodes) {
        if (node.getAttribute('row-index') != rowIndex) {
            node.classList.remove('ag-row-selected');
        }
    }
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    agGrid
        .simpleHttpRequest({
            url:
                'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json',
        })
        .then(function (data) {
            gridOptions.api.setRowData(data);
        });
});
