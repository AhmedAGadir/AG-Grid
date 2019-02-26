var columnDefs = [
    {
        headerName: 'Athlete',
        field: 'athlete',
        width: 150,
    },
    {
        headerName: 'Year',
        field: 'year',
        width: 90,
        filter: 'agSetColumnFilter',
        filterParams: {
            cellRenderer: 'yearFilterRenderer'
        },
        menuTabs: ['filterMenuTab']
    },
];

var gridOptions = {
    defaultColDef: {
        resizable: true,
        filter: true
    },
    components: {
        yearFilterRenderer: YearFilterRenderer
    },
    columnDefs: columnDefs,
    rowData: null,
};

function YearFilterRenderer() { }

YearFilterRenderer.prototype.init = function (params) {
    this.eGui = document.createElement('div');
    switch (params.value) {
        case '2000':
            this.eGui.innerHTML = '<i class="fas fa-cat"></i>';
            break;
        case '2002':
            this.eGui.innerHTML = '<i class="fas fa-crow"></i>';
            break;
        case '2004':
            this.eGui.innerHTML = '<i class="fas fa-dog"></i>';
            break;
        case '2006':
            this.eGui.innerHTML = '<i class="fas fa-dragon"></i>';
            break;
        case '2008':
            this.eGui.innerHTML = '<i class="fas fa-spider"></i>';
            break;
        case '2010':
            this.eGui.innerHTML = '<i class="fas fa-hippo"></i>';
            break;
        case '2012':
            this.eGui.innerHTML = '<i class="fas fa-horse"></i>';
            break;
        default:
            this.eGui.innerHTML = '<i class="fas fa-frog"></i>';
            ;
    }
}

YearFilterRenderer.prototype.getGui = function () {
    return this.eGui;
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    agGrid.simpleHttpRequest({ url: 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json' }).then(function (data) {
        gridOptions.api.setRowData(data);
    });
});
