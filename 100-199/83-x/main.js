var gridOptions = {
    columnDefs: [
        { headerName: 'Country', field: 'country', enableRowGroup: true, rowGroup: true, rowGroupIndex: 0, hide: true },
        { headerName: 'Sport', field: 'sport', enableRowGroup: true, rowGroup: true, rowGroupIndex: 1, hide: true },
        { headerName: 'Year', field: 'year', enableRowGroup: true, rowGroup: true, rowGroupIndex: 2, hide: true },
        { headerName: 'Age', field: 'age', enableRowGroup: true, rowGroup: true, rowGroupIndex: 3, hide: true },
        { headerName: 'Gold', field: 'gold', aggFunc: 'sum' },
        { headerName: 'Silver', field: 'silver', aggFunc: 'sum' },
        { headerName: 'Bronze', field: 'bronze', aggFunc: 'sum' },
        { headerName: 'Total', field: 'total', aggFunc: 'sum' }
    ],
    defaultColDef: {
        width: 150,
        // cellStyle: params => !params.node.group ? { backgroundColor: 'lightblue' } : null
    },
    autoGroupColumnDef: {
        width: 300,
        cellRendererParams: {
            suppressCount: true
        }
    },
    rowData: null,
    groupDefaultExpanded: -1,
    // getRowStyle: params => {
    //     if (!params.node.group) {
    //         return;
    //     }
    //     switch (params.node.level) {
    //         case 0:
    //             return { background: 'whitesmoke', color: 'grey', fontSize: '18px', borderTop: '2px solid grey', borderBottom: '1px solid grey' }
    //         case 2:
    //             return { background: 'whitesmoke', color: 'grey', borderTop: '2px solid grey', borderBottom: '2px solid grey' }
    //     }
    // },
    getRowHeight: params => {
        if (params.node.group) {
            return 45 - (5 * params.node.level)
        }
        return 27;
    },
};

function addWarning() {
    gridOptions.api.updateRowData({
        add: [{
            country: 'United States',
            sport: 'Swimming',
            text: 'This product has been denied for certain facilities and/or configurations',
            isFullWidthRow: true,
            gold: 10
        }]
    })
}

function removeWarning() {

}

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    agGrid
        .simpleHttpRequest({
            url:
                'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json',
        })
        .then(function (data) {
            gridOptions.api.setRowData(data.filter(row => row.country === 'United States' && row.sport === 'Swimming' && row.year === 2008 && (row.age === 23 || row.age === 24)));
        });
});
