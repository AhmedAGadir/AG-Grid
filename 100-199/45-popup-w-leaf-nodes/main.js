var gridOptions = {
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete' },
        { headerName: 'Sport', field: 'sport', rowGroup: true },
        { headerName: 'Country', field: 'country', rowGroup: true },
        { headerName: 'Age', field: 'age' },
        { headerName: 'Year', field: 'year' },
        { headerName: 'Date', field: 'date' },
        { headerName: 'Gold', field: 'gold', enableValue: true, aggFunc: 'sum' },
        { headerName: 'Silver', field: 'silver', enableValue: true, aggFunc: 'sum' },
        { headerName: 'Bronze', field: 'bronze', enableValue: true, aggFunc: 'sum' },
        { headerName: 'Total', field: 'total' }
    ],
    defaultColDef: {
        width: 150,
        cellRenderer: 'popupCellRenderer',
    },
    autoGroupColumnDef: {
        cellRendererParams: {
            innerRenderer: params => params.value,
        }
    },
    rowData: null,
    // sideBar: true,
    pivotMode: true,
    groupIncludeTotalFooter: true,
    components: {
        popupCellRenderer: PopupCellRenderer
    },
    onFirstDataRendered: params => params.api.sizeColumnsToFit()
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
            gridOptions.api.setRowData(data.slice(0, 100));
        });
});

function PopupCellRenderer() { }

PopupCellRenderer.prototype.init = function (params) {
    this.params = params;
    this.eGui = document.createElement('div');
    this.eGui.textContent = params.value;
    this.eGui.addEventListener('click', this.openInnerGrid.bind(this));
}

PopupCellRenderer.prototype.openInnerGrid = function () {
    var rowsToStore = [];
    if (this.params.node.footer) {
        this.params.api.forEachNode(node => {
            if (!node.group) {
                rowsToStore.push(node.data);
            }
        })
        console.log('storing all rows:', rowsToStore);
    } else {
        this.params.node.allLeafChildren.forEach(node => rowsToStore.push(node.data))
        console.log('storing leaf children:', rowsToStore);
    }
    localStorage.setItem('rowData', JSON.stringify(rowsToStore));
    popupWindow('./popup.html', 'innerGrid', 1000, 500);
}

PopupCellRenderer.prototype.getGui = function () {
    return this.eGui;
}

function popupWindow(url, title, w, h) {
    var left = (screen.width / 2) - (w / 2);
    var top = (screen.height / 2) - (h / 2);
    return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
}

