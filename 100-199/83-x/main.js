var state = {
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
    rowData: null,
    idSequence: 0
}

var gridOptions = {
    columnDefs: state.columnDefs,
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
    rowData: state.rowData,
    deltaColumnMode: true,
    deltaRowDataMode: true,
    getRowNodeId: data => data.id,
    isFullWidthCell: node => !node.group && node.data.isFullWidthRow,
    fullWidthCellRenderer: 'fullWidthCellRenderer',
    components: {
        fullWidthCellRenderer: FullWidthCellRenderer
    },
    groupDefaultExpanded: 3,
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
    onGridReady: params => params.api.sizeColumnsToFit(),
    suppressAggFuncInHeader: true
};

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    agGrid
        .simpleHttpRequest({
            url:
                'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json',
        })
        .then(function (data) {
            state.rowData = data
                .filter(row => row.country === 'United States' && row.sport === 'Swimming' && row.year === 2008 && (row.age === 23 || row.age === 24))
                .map(row => ({
                    ...row,
                    id: state.idSequence++
                }));
            gridOptions.api.setRowData(state.rowData);
        });
});

function addWarning() {

    // there is currently no easy way to insert a row at a specified index while grouping is active

    // remove grouping 
    let updatedColDefs = state.columnDefs.map(colDef => ({
        ...colDef,
        rowGroup: false
    }));
    state.columnDefs = updatedColDefs;
    gridOptions.api.setColumnDefs(state.columnDefs);

    // add new rows 
    const updatedRowData = state.rowData.map(row => ({ ...row }));
    updatedRowData.unshift(
        { country: 'United States', sport: 'Swimming', text: 'This product has been denied for certain facilities and/or configurations', isFullWidthRow: true, id: state.idSequence++ },
        { country: 'United States', sport: 'Swimming', gold: 'Gold', silver: 'Silver', bronze: 'Bronze', total: 'Total', id: state.idSequence++ }
    );
    state.rowData = updatedRowData;
    gridOptions.api.setRowData(state.rowData);

    // regroup the rows
    updatedColDefs = state.columnDefs.map(colDef => ({
        ...colDef,
        rowGroup: colDef.field === 'country' || colDef.field === 'age' || colDef.field === 'sport' || colDef.field === 'year'
    }));
    state.columnDefs = updatedColDefs;
    gridOptions.api.setColumnDefs(state.columnDefs);

    // resize columns
    gridOptions.api.sizeColumnsToFit()
}

function removeWarning() {

}

function FullWidthCellRenderer() { }

FullWidthCellRenderer.prototype.init = function (params) {
    this.eGui = document.createElement('div');
    this.eGui.style.cssText = 'padding: 0 15px; background: whitesmoke; height: 100%; display: flex; align-items: center'
    this.eGui.innerHTML = `<p><i class="fas fa-exclamation" style="color: red"></i> ${params.data.text}</p>`;
}

FullWidthCellRenderer.prototype.getGui = function () {
    return this.eGui;
}