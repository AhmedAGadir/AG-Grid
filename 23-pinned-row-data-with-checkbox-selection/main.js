var gridOptions = {
    columnDefs: [
        { 
            headerName: 'Athlete', 
            field: 'athlete',
            cellRenderer: Checkbox, 
            // headerCheckboxSelection: true, 
            // checkboxSelection: true 
        },
        { headerName: 'Sport',field: 'sport' },
        { headerName: 'Age', field: 'age' },
        { headerName: 'Year', field: 'year' },
        { headerName: 'Date', field: 'date' },
        { headerName: 'Gold', field: 'gold' },
        { headerName: 'Silver', field: 'silver' },
        { headerName: 'Bronze', field: 'bronze' },
    ],
    getRowStyle: params => params.node.rowPinned ? {backgroundColor: 'skyblue'} : null,
    rowSelection: 'multiple',
    onFirstDataRendered: params => {
        params.api.forEachNode((node, ind) => {
            // console.log(node.data.athlete)
            if (node.isRowPinned()) {
                console.log(node)
            }
        })
    }
};

function Checkbox() {}
Checkbox.prototype.init = function(params) {

    this.params = params;
    this.eGui = document.createElement('span');
    this.eGui.innerHTML =  `<input type="checkbox" class="checkbox-input"> ${params.value}</>`; 
    this.eCheckbox = this.eGui.querySelector('.checkbox-input');
    this.params.api.addEventListener('rowSelected', params => {
        if (params.node === this.params.node) {
            console.log(123)
        }
    })
};

Checkbox.prototype.getGui = function() {
    return this.eGui;
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    agGrid
        .simpleHttpRequest({
            url:
                'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json',
        })
        .then(function(data) {
            gridOptions.api.setPinnedTopRowData(data.slice(0,5))
            gridOptions.api.setRowData(data.slice(5));
        });
});
