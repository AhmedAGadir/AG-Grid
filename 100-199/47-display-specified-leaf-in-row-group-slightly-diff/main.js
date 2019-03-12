var columnDefs = [
    { field: 'year', rowGroup: true, hide: true },
    { field: 'component' },
    { field: 'entityName' },
]

var rowData = [
    { component: 'Component1', entityName: 'foo', year: 2019, isRowGroupHeader: false },
    { component: 'Component2', entityName: 'bar', year: 2019, isRowGroupHeader: false },
    { component: 'Component3', entityName: 'foobar', year: 2019, isRowGroupHeader: false },
    { component: 'Component4', entityName: 'baz', year: 2019, isRowGroupHeader: true },
    { component: 'Component5', entityName: 'waldo', year: 2019, isRowGroupHeader: false },
    { component: 'Component6', entityName: 'qux', year: 2020, isRowGroupHeader: false },
    { component: 'Component7', entityName: 'quux', year: 2020, isRowGroupHeader: false },
    { component: 'Component8', entityName: 'corge', year: 2020, isRowGroupHeader: false },
    { component: 'Component9', entityName: 'uier', year: 2020, isRowGroupHeader: true },
    { component: 'Component10', entityName: 'garply', year: 2020, isRowGroupHeader: false },
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
    rowData: rowData,
    onRowGroupOpened: params => {
        params.api.refreshCells({rowNodes: [params.node]})
    }
};

function myValueGetter(params) {
    if (params.node.group) {
        if (params.node.expanded) {
            return null;
        }
        let rowGroupHeaderInd = params.node.allLeafChildren.findIndex(node => node.data.isRowGroupHeader);
        return params.node.allLeafChildren[rowGroupHeaderInd].data[params.colDef.field]
    }
    return params.node.data[params.colDef.field];
}

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
});
