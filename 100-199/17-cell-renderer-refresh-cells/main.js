var gridOptions = {
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete', cellRenderer: 'myCellRenderer', width: 200 },
        { headerName: 'Country', field: 'country' },
        { headerName: 'Sport', field: 'sport' },
        { headerName: 'Age', field: 'age' },
        { headerName: 'Year', field: 'year' },
        { headerName: 'Date', field: 'date' },
        { headerName: 'Gold', field: 'gold' },
        { headerName: 'Silver', field: 'silver' },
        { headerName: 'Bronze', field: 'bronze' },
        { headerName: 'Total', field: 'total' }
    ],
    defaultColDef: {
        width: 150,
    },
    components: {
        myCellRenderer: MyCellRenderer
    },
    rowData: null,
};

function toggleAthleteNameCase() {
    // Method 1 - {force: true} must be included in the refreshCells params as the grid will not detect any changes in the node
    // gridOptions.api.forEachNode(node => node.data.athlete.isCapitalized = !node.data.athlete.isCapitalized);
    // gridOptions.api.refreshCells({ force: true });

    // Method 2 - a new object is assigned to the athlete property, so you dont need to use {force: true} as the grid will detect this change
    // gridOptions.api.forEachNode(node => {
    //     node.data.athlete = {
    //         name: node.data.athlete.name,
    //         isCapitalized: !node.data.athlete.isCapitalized
    //     }
    // });
    // gridOptions.api.refreshCells();
}

function MyCellRenderer() { }

MyCellRenderer.prototype.init = function (params) {
    this.eGui = document.createElement('div');
    this.eGui.innerHTML = params.value.isCapitalized ? params.value.name.toUpperCase() : params.value.name.toLowerCase();
}

MyCellRenderer.prototype.getGui = function () {
    return this.eGui;
}

// can react to refreshCells here
// if a refresh method is not provided on the cellRenderer, the grid will destroy the cell and instantiate a new instance
// comment out the refresh method to see this
MyCellRenderer.prototype.refresh = function (params) {
    this.eGui.innerHTML = params.value.isCapitalized
        ? params.value.name.replace(/(\b)(\w)/g, (_, boundary, firstLetter) => boundary + firstLetter.toUpperCase())
        : params.value.name.replace(/(\b)(\w)/g, (_, boundary, firstLetter) => boundary + firstLetter.toLowerCase())
    return true;
}

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    agGrid
        .simpleHttpRequest({
            url:
                'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json',
        })
        .then(function (rowData) {
            rowData = rowData.map(row => ({
                ...row,
                athlete: {
                    name: row.athlete,
                    isCapitalized: false
                }
            }));
            gridOptions.api.setRowData(rowData);
        });
});