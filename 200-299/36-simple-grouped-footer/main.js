var columnDefs = [
    {
        headerName: 'Athlete',
        field: 'athlete',
        valueFormatter: params => params.value ? params.value : 'Total',
        width: 150
    },
    { headerName: 'Gold', field: 'gold', aggFunc: 'sum' },
    { headerName: 'Silver', field: 'silver', aggFunc: 'sum' },
    { headerName: 'Bronze', field: 'bronze', aggFunc: 'sum' },
    { headerName: 'Total', field: 'total', aggFunc: 'sum' },
];

var gridOptions = {
    columnDefs: columnDefs,
    defaultColDef: {
        width: 100,
    },
    getRowStyle: params => {
        if (params.node.group) {
            return {fontWeight: 'bold'}
        } 
    },
    groupIncludeTotalFooter: true
    };

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    // do http request to get our sample data - not using any framework to keep the example self contained.
    // you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
    agGrid
        .simpleHttpRequest({
            url:
                'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json',
        })
        .then(function(data) {
            data = data.slice(0, 30);
            gridOptions.api.setRowData(data);
        });
});
