var columnDefs = [
    {
        headerName: 'Athlete Details',
        children: [
            { headerName: 'Athlete', field: 'athlete', width: 150, filter: 'agTextColumnFilter', hide: true, },
            { headerName: 'Age', field: 'age', width: 90, filter: 'agNumberColumnFilter', hide: true, },
            { headerName: 'Country', field: 'country', width: 120, hide: true, }
        ]
    },
    {
        headerName: 'Sports Results',
        children: [
            { headerName: 'Sport', field: 'sport', width: 110, enableValue: true },
            { headerName: 'Total', columnGroupShow: 'closed', field: 'total', width: 100, filter: 'agNumberColumnFilter', enableValue: true },
            { headerName: 'Gold', columnGroupShow: 'open', field: 'gold', width: 100, filter: 'agNumberColumnFilter', enableValue: true },
            { headerName: 'Silver', columnGroupShow: 'open', field: 'silver', width: 100, filter: 'agNumberColumnFilter', enableValue: true },
            { headerName: 'Bronze', columnGroupShow: 'open', field: 'bronze', width: 100, filter: 'agNumberColumnFilter', enableValue: true }
        ]
    }
];

var gridOptions = {
    defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true
    },
    // debug: true,
    columnDefs: columnDefs,
    rowData: null,
    sideBar: true,
    onDisplayedColumnsChanged: params => {
        // debugger;
        // console.log('onDisplayedColumnsChanged', params.columnApi.getAllDisplayedColumns().map(col => col.colId));
    },
    onColumnValueChanged: params => {
        console.log('displayedcols', params.columnApi.getAllDisplayedColumns().map(col => col.colId));
        console.log('valuecols', params.columnApi.getValueColumns().map(col => col.colId))

        // let displayedColGroups = params.columnApi.getAllDisplayedColumnGroups();

        // displayedColGroups.forEach(displayedColGroup => {
        // if (displayedColGroup.getDisplayedChildren().length === 0 && displayedColGroup.getChildren().length > 0) {
        // debugger;
        // console.log(123)
        // console.log('secondary', params.columnApi.getSecondaryColumns())

        // debugger;
        // var valueCols = params.columnApi.getValueColumns();
        // displayedColGroup.setExpanded(true)
        // params.columnApi.setValueColumns(valueCols);
        // params.api.refreshHeader();
        // params.api.redrawRows();

        // }
        // })

        debugger;

        let displayedColGroups = params.columnApi.getAllDisplayedColumnGroups();

        if (displayedColGroups[0].getDisplayedChildren().length === 0 && displayedColGroups[0].getChildren().length > 0) {
            // go through all the children in the primary column def and if were not expanded, expand and set displayed columns to those that open when expanded + ones that are always open
            // if were expanded then shrink and set displayed columns to be the ones that are open when shrunk and the ones that are always open
            console.log(123)
            // debugger;
        }

    },
    onGridReady: params => {
        // debugger
        // ToolPanelColumnComp.addEventListener('checkBoxChanged, params => console.log(123))
    }
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    agGrid.simpleHttpRequest({ url: 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json' }).then(function (data) {
        gridOptions.api.setRowData(data);
    });
});