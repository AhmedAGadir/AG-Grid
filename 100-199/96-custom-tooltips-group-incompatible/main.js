
var gridOptions = {
    columnDefs: [
        {
            headerName: 'Country',
            field: 'country',
            tooltipField: 'country',
            tooltipComponentParams: { bkgClass: 'primary' },
            rowGroup: true,
            hide: true
        },
        {
            headerName: "Athlete",
            field: "athlete",
            tooltipField: 'athlete',
            tooltipComponentParams: { bkgClass: "primary" }

        },
        {
            headerName: 'Gold',
            field: 'gold',
            tooltipField: 'gold',
            tooltipComponentParams: { bkgClass: 'warning' }

        },
        {
            headerName: 'Silver',
            field: 'silver',
            tooltipField: 'silver',
            tooltipComponentParams: { bkgClass: 'default' }

        },
        {
            headerName: 'Bronze',
            field: 'bronze',
            tooltipField: 'bronze',
            tooltipComponentParams: { bkgClass: 'info' }

        }

    ],
    defaultColDef: {
        sortable: true,
        tooltipComponent: 'customTooltip'
    },
    rowData: null,
    components: {
        customTooltip: CustomTooltip,
    },
    onFirstDataRendered: params => params.api.sizeColumnsToFit(),
    groupDefaultExpanded: -1,
};

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json');
    httpRequest.send();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            var rowData = JSON.parse(httpRequest.responseText).slice(0, 100);
            gridOptions.api.setRowData(rowData);
        }
    };
});


function CustomTooltip() { }

CustomTooltip.prototype.init = function (params) {
    this.eGui = document.createElement('div');
    this.eGui.classList.add('custom-tooltip');
    this.eGui.innerHTML =
        `<div class="panel panel-${params.bkgClass}">
        <div class="panel-heading">
            <h3 class="panel-title">${params.column.colDef.headerName}</h3>
        </div>
        <div class="panel-body">
            ${params.value}
        </div>
    </div>`
};

CustomTooltip.prototype.getGui = function () {
    return this.eGui;
};
