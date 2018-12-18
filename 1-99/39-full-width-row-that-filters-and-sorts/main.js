var rowData = [
    {
        name: 'United Kingdom',
        continent: 'Europe',
        code: 'gb',
        population: 4000000,
    },
    {
        name: 'United Kingdom',
        continent: 'Europe',
        code: 'gb',
        population: 4000000,
        tags: ['tag1', 'tag2','tag3', 'tag4','tag5','tag1', 'tag2','tag3', 'tag4','tag5','tag1', 'tag2','tag3', 'tag4','tag5','tag1', 'tag2','tag3', 'tag4','tag5']
    },
    {
        name: 'Germany',
        continent: 'Europe',
        code: 'de',
        population: 4000000,
    },
    {
        name: 'Germany',
        continent: 'Europe',
        code: 'de',
        population: 4000000,
        tags: ['tag1', 'tag2']
    }
];

var columnDefs = [
    { 
        field: 'name', 
        headerCheckboxSelection: true,
        checkboxSelection: true, 
    },
    { field: 'continent' },
    { field: 'code', width: 60},
    { field: 'population', width: 80 },
];

var gridOptions = {
    enableSorting: true,
    enableFilter: true,
    columnDefs: columnDefs,
    rowData: rowData,
    isFullWidthCell: node => isFullWidth(node),
    components: {
        fullWidthCellRenderer: FullWidthCellRenderer,
    },
    fullWidthCellRenderer: 'fullWidthCellRenderer',
    getRowHeight: function(params) {
        return isFullWidth(params) ? 70 : 25;
    },
    onGridReady: function(params) {
        params.api.sizeColumnsToFit();
    },
};

function isFullWidth(node) {
    return node.data.tags !== undefined
}

document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
});
