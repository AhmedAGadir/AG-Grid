function changeGoldVals() {
    gridOptions.api.forEachNode(node => node.setDataValue('gold', null));
    // gridOptions.api.forEachNode(node => node.setDataValue('gold', 0));
    // gridOptions.api.forEachNode(node => node.setDataValue('gold', undefined));
}

var gridOptions = {
    columnDefs: [{
        headerName: "Athlete",
        field: "athlete",
        width: 150,
        tooltipField: 'athlete',
        tooltipComponentParams: {
            bkgClass: "info"
        }
    }, {
        headerName: 'Gold',
        field: 'gold',
        width: 100,
        tooltipField: 'gold',
        tooltipComponentParams: {
            bkgClass: "warning"
        },
        valueFormatter: params => params.value === null ? '' : params.value
    }
    ],
    defaultColDef: {
        sortable: true,
        tooltipComponent: 'customTooltip'
    },
    rowData: null,
    components: {
        customTooltip: CustomTooltip,
    }
};

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json');
    httpRequest.send();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            var rowData = JSON.parse(httpRequest.responseText).slice(0, 50);
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
