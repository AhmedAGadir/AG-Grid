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
        width: 250,
        editable: true,
        valueFormatter: params => {
            return params.data[params.column.colId].replace(/&#13;&#10;/g, '\r\n');
        },
    },
    rowData: null,
    rowHeight: 60,
};

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    agGrid
        .simpleHttpRequest({
            url: 'olympicWinners.json'
        })
        .then(function (data) {
            data = data.map(row => {
                let newRow = {};
                // https://stackoverflow.com/questions/8627902/new-line-in-text-area
                Object.keys(row).forEach(field => newRow[field] = row[field].replace(/(\r\n|<br\/>)/g, '&#13;&#10;'));
                return newRow;
            });
            gridOptions.api.setRowData(data);
        });
});