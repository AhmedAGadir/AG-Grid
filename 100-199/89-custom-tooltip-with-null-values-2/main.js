const HIDE_VALUE = '__hide_this__';

function changeGoldVals() {
    gridOptions.api.forEachNode(node => node.setDataValue('gold', null));
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
        valueFormatter: params => params.value === HIDE_VALUE ? '' : params.value
    }
    ],
    defaultColDef: {
        sortable: true,
        tooltipComponent: 'customTooltip',
    },
    rowData: null,
    components: {
        customTooltip: CustomTooltip,
    },
    onCellValueChanged: params => {
        if (params.newValue) {
            return;
        }
        params.node.setDataValue(params.column.colId, HIDE_VALUE);
    }
};

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    let data = [{ gold: '', athlete: 'MK' }, { athlete: 'JK', gold: '' }];
    // must first map over data
    let mappedData = data.map(d => ({
        ...d,
        gold: d.gold ? d.gold : HIDE_VALUE
    }));
    gridOptions.api.setRowData(mappedData);
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
         ${params.value === HIDE_VALUE ? null : params.value}
        </div>
        </div>`

    console.log(params.value);
};

CustomTooltip.prototype.getGui = function () {
    return this.eGui;
};
