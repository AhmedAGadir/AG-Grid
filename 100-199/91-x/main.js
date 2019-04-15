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
        width: 200,
        filter: 'agSetColumnFilter',
        filterParams: {
            selectAllOnMiniFilter: false
        },
        floatingFilterComponent: 'myCustomFloatingFilter',
    },
    floatingFilter: true,
    rowData: null,
    components: {
        myCustomFloatingFilter: MyCustomFloatingFilter
    },
    onFilterChanged: params => console.log(params.api.getFilterModel())

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
            gridOptions.api.setRowData(data);
        });
});

function MyCustomFloatingFilter() { }

MyCustomFloatingFilter.prototype.init = function (params) {
    this.filterModel = null;

    this.eButton = document.createElement('button');
    this.eButton.textContent = 'Reset';
    this.eButton.onclick = function () {
        params.api.setFilterModel(null)
    }
}

MyCustomFloatingFilter.prototype.getGui = function () {
    return this.eButton;
}

MyCustomFloatingFilter.prototype.onParentModelChanged = function (parentModel) {
    this.filterModel = parentModel;
}