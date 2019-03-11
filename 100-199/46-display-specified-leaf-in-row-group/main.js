var columnDefs = [
    { field: 'year', rowGroup: true, hide: true },
    { field: 'component' },
    { field: 'entityName' },
]

var rowGroupHeaders = {}

var rowData = [
    { component: 'Component1', entityName: 'foo', year: 2019, rowGroupHeader: false },
    { component: 'Component2', entityName: 'bar', year: 2019, rowGroupHeader: false },
    { component: 'Component3', entityName: 'foobar', year: 2019, rowGroupHeader: false },
    { component: 'Component4', entityName: 'baz', year: 2019, rowGroupHeader: true },
    { component: 'Component5', entityName: 'waldo', year: 2019, rowGroupHeader: false },
    { component: 'Component6', entityName: 'qux', year: 2020, rowGroupHeader: false },
    { component: 'Component7', entityName: 'quux', year: 2020, rowGroupHeader: false },
    { component: 'Component8', entityName: 'corge', year: 2020, rowGroupHeader: false },
    { component: 'Component9', entityName: 'uier', year: 2020, rowGroupHeader: true },
    { component: 'Component10', entityName: 'garply', year: 2020, rowGroupHeader: false },
]

var gridOptions = {
    columnDefs: columnDefs,
    defaultColDef: {
        width: 150,
        valueGetter: myValueGetter
    },
    autoGroupColumnDef: {
        cellRendererParams: {
            suppressCount: true
        }
    },
    rowData: null,
    onGridReady: onGridReady
};

function onGridReady(params) {
    let rowDataWithoutRowGroupHeaders = [];
    rowData.forEach(row => {
        if (row.rowGroupHeader) {
            rowGroupHeaders[row.year] = row;
        } else {
            rowDataWithoutRowGroupHeaders.push(row);
        }
    });
    params.api.setRowData(rowDataWithoutRowGroupHeaders);
}

function myValueGetter(params) {
    if (params.node.group) {
        return rowGroupHeaders[params.node.key][params.colDef.field];
    }
    return params.node.data[params.colDef.field];
}

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
});
