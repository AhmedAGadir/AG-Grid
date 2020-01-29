
import * as agGrid from 'ag-grid-community';
import 'ag-grid-enterprise';
import './styles/styles.scss';

var gridOptions = {
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete' },
        { headerName: 'Country with an extra long header name', field: 'country' },
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
        filter: true
    },
    rowData: null,
    // onGridReady: params => params.api.sizeColumnsToFit(),
    enableRangeSelection: true,
    rowSelection: 'multiple'
};

document.addEventListener('DOMContentLoaded', function () {

    document.querySelector('#sizeToFit').addEventListener('click', sizeToFit);
    document.querySelector('#autoSizeAllFalse').addEventListener('click', () => autoSizeAll(false));
    document.querySelector('#autoSizeAllTrue').addEventListener('click', () => autoSizeAll(true));

    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    agGrid.simpleHttpRequest({
        url:
            'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json',
    })
        .then(function (data) {
            gridOptions.api.setRowData(data);
        });
});

function sizeToFit() {
    gridOptions.api.sizeColumnsToFit();
}
function autoSizeAll(skipHeader) {
    var allColumnIds = [];
    gridOptions.columnApi.getAllColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
    });
    gridOptions.columnApi.autoSizeColumns(allColumnIds, skipHeader);
}
