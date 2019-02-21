var columnDefs = [
    {
        headerName: 'Athlete',
        field: 'athlete',
        width: 150,
        filter: 'agSetColumnFilter',
        filterParams: {cellHeight: 20, debounceMs: 1000}
    },
    {headerName: 'Country',field: 'country',width: 140,filter: 'agSetColumnFilter'},
];

var gridOptions = {
    defaultColDef: {
        menuTabs: ['filterMenuTab'],
        resizable: true,
        filter: true
    },
    columnDefs: columnDefs,
    rowData: null,
    postProcessPopup: postProcessPopup
};

function postProcessPopup(params) {
    if (params.type !== 'columnMenu' || params.column.colDef.filter !== 'agSetColumnFilter') {
        return;
    }
    $(params.ePopup).on('keydown', '.ag-filter-filter', e => {
        if (e.key === 'Enter') {
            const model = this.gridOptions.api.getFilterInstance(params.column.colId);
            const filter = model.getMiniFilter();
            if (filter) {
                model.selectNothing();
                const valueCount = model.getUniqueValueCount();
                for (let i = 0; i < valueCount; i++) {
                    const value = model.getUniqueValue(i);
                    if ((value || '').toUpperCase().indexOf(filter.toUpperCase()) > -1) {
                        model.selectValue(value);
                    }
                }
            } else {
                model.selectEverything();
            }
            this.gridOptions.api.onFilterChanged();
        }
    })
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    agGrid.simpleHttpRequest({url: 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json'}).then(function(data) {
        gridOptions.api.setRowData(data);
    });
});
