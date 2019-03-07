var gridOptions = {
    columnDefs: [
        {
            headerName: 'Wiki',
            field: 'athlete',
            cellRenderer: 'wikiCellRenderer'
        },
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
    rowData: null,
    components: {
        wikiCellRenderer: WikiCellRenderer
    }
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
            data = data.slice(0, 10);
            gridOptions.api.setRowData(data);
        });
});

function WikiCellRenderer() { }

WikiCellRenderer.prototype.init = function (params) {
    var link = `https://en.wikipedia.org/wiki/${params.value.replace(/\s/g, '_')}`
    this.eGui = document.createElement('div');
    this.eGui.innerHTML = `
    <a  
        href="${link}" 
        target="popup" 
        onclick="window.open('${link}','popup','width=600,height=600'); return false;">${params.value}</a>`;
}

WikiCellRenderer.prototype.getGui = function () {
    return this.eGui;
}