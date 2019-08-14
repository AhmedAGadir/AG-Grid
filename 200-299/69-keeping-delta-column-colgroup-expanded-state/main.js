const store = {
    columnDefs: [
        {
            headerName: 'Athlete Details',
            groupId: 'athlete-details',
            children: [
                {colId: 'athlete', headerName: 'Athlete', field: 'athlete', width: 150, filter: 'agTextColumnFilter'},
                {colId: 'age', headerName: 'Age', field: 'age', width: 90, filter: 'agNumberColumnFilter'},
            ]
        },
        {
            headerName: 'Sports Results',
            groupId: 'sports-result',
            openByDefault: false,
            children: [
                {colId: 'sport', headerName: 'Sport', field: 'sport', width: 110},
                {colId: 'total', headerName: 'Total', columnGroupShow: 'closed', field: 'total', width: 100, filter: 'agNumberColumnFilter'},
                {colId: 'gold', headerName: 'Gold', columnGroupShow: 'open', field: 'gold', width: 100, filter: 'agNumberColumnFilter'},
                {colId: 'silver', headerName: 'Silver', columnGroupShow: 'open', field: 'silver', width: 100, filter: 'agNumberColumnFilter'},
                {colId: 'bronze', headerName: 'Bronze', columnGroupShow: 'open', field: 'bronze', width: 100, filter: 'agNumberColumnFilter'}
            ]
        }
    ]
};

function addYearCol() {
    let updatedColumnDefs = store.columnDefs.map(colDef => {
            let updatedColDef = {...colDef};
            if (colDef.hasOwnProperty('children')) {
                updatedColDef.children = colDef.children.map(cD => ({...cD}));
            }
            if (colDef.groupId ==='athlete-details') {
                let yearColumn = {colId: 'year', headerName: 'Year', field: 'year', width: 110};
                updatedColDef.children.push(yearColumn)
            }
            return updatedColDef;
        });
        console.log('updatedColumnDefs', updatedColumnDefs);
        store.columnDefs = updatedColumnDefs;
        gridOptions.api.setColumnDefs(updatedColumnDefs);
}

var gridOptions = {
    rowData: null,
    defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true
    },
    columnDefs: store.columnDefs,
    deltaColumnMode: true,
    onColumnGroupOpened: params => {
        let updatedColumnDefs = store.columnDefs.map(colDef => {
            let updatedColDef = {...colDef};
            if (colDef.hasOwnProperty('children')) {
                updatedColDef.children = colDef.children.map(cD => ({...cD}));
            }
            if (colDef.hasOwnProperty('openByDefault')) {
                updatedColDef.openByDefault = params.columnGroup.groupId === colDef.groupId ? params.columnGroup.isExpanded()  : colDef.openByDefault
            }
            return updatedColDef;
        });
        console.log('updatedColumnDefs', updatedColumnDefs);
        store.columnDefs = updatedColumnDefs;
        params.api.setColumnDefs(updatedColumnDefs);
    }
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    agGrid.simpleHttpRequest({url: 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json'}).then(function(data) {
        gridOptions.api.setRowData(data);
    });
});