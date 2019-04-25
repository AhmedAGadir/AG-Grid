var gridOptions = {
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete' },
        { headerName: 'Country', field: 'country', cellRenderer: 'buttonCellRenderer' },
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
    components: {
        buttonCellRenderer: ButtonCellRenderer
    },
    onCellFocused: params => {
        if (params.column.colId === 'country') {
            const cellRendererInstance = gridOptions.api.getCellRendererInstances({ rowNodes: [params.api.getRowNode(params.rowIndex)], columns: [params.column] })[0];
            cellRendererInstance.eGui.focus();
        }
    }
};

function ButtonCellRenderer() { }

ButtonCellRenderer.prototype.init = function (params) {
    this.eGui = document.createElement('button');
    this.eGui.className = 'button-cell-renderer';
    this.eGui.textContent = 'Click me!';
    this.eGui.addEventListener('click', () => alert(params.value));
}

ButtonCellRenderer.prototype.getGui = function () {
    return this.eGui;
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
            gridOptions.api.setRowData(data);
        });
}); 
