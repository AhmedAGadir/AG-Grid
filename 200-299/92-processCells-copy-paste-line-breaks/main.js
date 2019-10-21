var columnDefs = [
    {
        headerName: 'Address',
        field: 'address',
    },
];

var rowData = [
    { address: 'USA\nUK\nKSA' },
    { address: 'Seul\rSouth Korea' },
    { address: 'Dhaka\tBangladesh' },
    { address: 'Spain' },
    { address: 'Russia' },
    { address: 'Indonesia' },
    { address: 'Nepal' },
];

var gridOptions = {
    columnDefs: columnDefs,
    rowData: rowData,
    defaultColDef: {
        editable: true,
    },
    rowSelection: 'multiple',
    enableRangeSelection: true,
    // onPasteStart: params => {
    //     console.log('onPasteStart', params);
    // },
    // onPasteEnd: params => {
    //     console.log('onPasteEnd', params);
    // },
    processCellForClipboard: params => {
        return params.value.replace(/\n|\r|\t/g, ' ');
    },
    // processCellFromClipboard: params => {
    //     return params.value;
    // }
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
});
