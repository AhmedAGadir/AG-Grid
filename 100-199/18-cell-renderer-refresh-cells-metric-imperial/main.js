var gridOptions = {
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete' },
        {
            headerName: 'Age',
            field: 'age',
            headerComponent: 'myHeaderComponent',
            cellRenderer: 'myCellRenderer',
            width: 200
        },
        { headerName: 'Country', field: 'country' },
        { headerName: 'Sport', field: 'sport' },
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
    components: {
        myHeaderComponent: MyHeaderComponent,
        myCellRenderer: MyCellRenderer,
    },
    rowData: null,
};

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    agGrid
        .simpleHttpRequest({
            url:
                'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json',
        })
        .then(function (rowData) {
            gridOptions.api.setRowData(rowData);
        });
});

let ageIn = 'years'

function showAge(metric) {
    ageIn = metric;
    gridOptions.api.refreshHeader();
    // force: true must be included in the refreshCells params since the underlying data isnt changing
    gridOptions.api.refreshCells({ force: true });
}

function MyHeaderComponent() { }

MyHeaderComponent.prototype.init = function () {
    this.eHeader = document.createElement('div');
    this.eHeader.innerHTML = ageIn === 'months' ? "Age('Months')" : "Age('Years')";
}

MyHeaderComponent.prototype.getGui = function () {
    return this.eHeader;
}

MyHeaderComponent.prototype.destroy = function () {
}

function MyCellRenderer() { }

MyCellRenderer.prototype.init = function (params) {
    this.eGui = document.createElement('div');
    this.eGui.innerHTML = ageIn === 'months' ? params.value * 12 : params.value;
}

MyCellRenderer.prototype.getGui = function () {
    return this.eGui;
}

MyCellRenderer.prototype.refresh = function (params) {
    this.eGui.innerHTML = ageIn === 'months' ? params.value * 12 : params.value;
}