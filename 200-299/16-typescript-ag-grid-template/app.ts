
import * as agGrid from 'ag-grid-community';
import 'ag-grid-enterprise';
import './styles/styles.scss';


var gridOptions = {
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete' },
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
        filter: true
    },
    rowData: null,
    onGridReady: params => params.api.sizeColumnsToFit(),
    enableRangeSelection: true,
    rowSelection: 'multiple'
};

document.addEventListener('DOMContentLoaded', function () {
    let gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    agGrid.simpleHttpRequest({
        url:
            'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json',
    })
        .then(function (data) {
            agGrid.gridOptions.api.setRowData(data);
        });
}); 
