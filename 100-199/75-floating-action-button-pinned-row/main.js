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
        resizable: true,
        editable: true
    },
    rowData: null,
    onFirstDataRendered: params => params.columnApi.autoSizeAllColumns(),
    pinnedBottomRowData: getBlankRow(),
    getRowHeight: params => params.node.isRowPinned() ? 50 : 28,
    isFullWidthCell: params => params.rowPinned,
    fullWidthCellRenderer: 'fullWidthCellRenderer',
    components: {
        fullWidthCellRenderer: FullWidthCellRenderer
    }
};

function getBlankRow() {
    return [{
        athlete: null,
        country: null,
        sport: null,
        age: null,
        year: null,
        date: null,
        gold: null,
        silver: null,
        bronze: null,
        total: null,
    }];
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
            gridOptions.api.setRowData(data.slice(0, 50));
        });
});

function FullWidthCellRenderer() { }

FullWidthCellRenderer.prototype.init = function (params) {
    this.eGui = document.createElement('div');
    this.eGui.className = 'full-width-cell-renderer'
    this.eGui.innerHTML = `
    <button class="mdc-fab mdc-fab--mini" aria-label="Add Row">
        <span class="material-icons mdc-fab__icon">add</span>
    </button>`;
    this.eGui.querySelector('button').addEventListener('click', () => {
        // add blank row
        params.api.updateRowData({ add: getBlankRow() });
        // scroll to bottom of grid
        const eCenterViewPortHeight = document.querySelector('[ref="eCenterViewport"').offsetHeight;
        params.api.gridPanel.setVerticalScrollPosition(eCenterViewPortHeight);
    })
}

FullWidthCellRenderer.prototype.getGui = function () {
    return this.eGui;
}

