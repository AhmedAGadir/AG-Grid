var columnDefs = [
    {
        headerName: "A",
        field: 'a',
    },
    {
        headerName: "B",
        field: 'b',
    },
    {
        headerName: "A + B", colId: 'a&b',
        valueGetter: params => params.data.a + params.data.b,
        cellRenderer: 'myCellRenderer'
    },
];

function createRowData() {
    var rowData = [];
    for (var i = 0; i < 100; i++) {
        rowData.push({
            a: Math.floor(i % 4),
            b: Math.floor(i % 7)
        });
    }
    return rowData;
}

var gridOptions = {
    defaultColDef: {
        resizable: true,
        cellClass: 'number-cell'
    },
    columnDefs: columnDefs,
    rowData: createRowData(),
    components: {
        myCellRenderer: MyCellRenderer
    },
    onCellClicked: params => {
        let renderedValue;
        if (params.column.colId === 'a&b') {
            renderedValue = params.api.getCellRendererInstances({
                rowNodes: [params.node],
                columns: [params.column]
            })[0].eGui.innerHTML;
        } else {
            renderedValue = params.value;
        }
        document.querySelector('span#output').innerHTML = renderedValue;
    }
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
});

function MyCellRenderer() { }

MyCellRenderer.prototype.init = function (params) {
    this.eGui = document.createElement('div')
    this.eGui.innerHTML = '£' + params.value;
}

MyCellRenderer.prototype.getGui = function () {
    return this.eGui;
}