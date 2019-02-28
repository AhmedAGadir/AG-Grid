const COUNTRY_CODES = {
    Ireland: "ie",
    Luxembourg: "lu",
    Belgium: "be",
    Spain: "es",
    "United Kingdom": "gb",
    France: "fr",
    Germany: "de",
    Sweden: "se",
    Italy: "it",
    Greece: "gr",
    Iceland: "is",
    Portugal: "pt",
    Malta: "mt",
    Norway: "no",
    Brazil: "br",
    Argentina: "ar",
    Colombia: "co",
    Peru: "pe",
    Venezuela: "ve",
    Uruguay: "uy"
};

function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

var debouncedAutoSizeColumns = debounce(autoSizeColumns, 500);

let alreadyAutoSized = false;
function autoSizeColumns() {
    if (alreadyAutoSized) {
        return;
    }
    var columns = gridOptions.columnApi.getAllDisplayedColumns();
    var widestNode = 0;
    gridOptions.api.forEachNode(node => {
        var cellRenderer = gridOptions.api.getCellRendererInstances({ rowNodes: [node], columns: ['country'] })[0];
        if (!cellRenderer) {
            return;
        }
        var nodeWidth = Array.from(cellRenderer.eGui.querySelectorAll('img'))
            .map(img => img.width + 4) // adding 4px to account for image margins
            .reduce((a, b) => a + b) + 22; //adding 22px to account for cell padding
        widestNode = nodeWidth > widestNode ? nodeWidth : widestNode;
    })
    gridOptions.columnApi.setColumnWidth(columns[0], widestNode);
    columns.shift();
    columns.forEach(column => { gridOptions.columnApi.autoSizeColumn(column) });
    alreadyAutoSized = true;
}

const gridOptions = {
    columnDefs: [
        {
            headerName: 'Country',
            field: 'country',
            cellRenderer: 'countryCellRenderer',
            cellRendererParams: {
                onImageLoaded: debouncedAutoSizeColumns
            }
        },
        { headerName: 'Athlete', field: 'athlete' },
        { headerName: 'Sport', field: 'sport' },
        { headerName: 'Age', field: 'age' },
        { headerName: 'Year', field: 'year' },
        { headerName: 'Date', field: 'date' },
        { headerName: 'Gold', field: 'gold' },
        { headerName: 'Silver', field: 'silver' },
        { headerName: 'Bronze', field: 'bronze' },
    ],
    defaultColDef: {
        width: 150,
        resizable: true
    },
    rowData: null,
    components: {
        countryCellRenderer: CountryCellRenderer,
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
            data = data.filter(row => Object.keys(COUNTRY_CODES).includes(row.country));
            gridOptions.api.setRowData(data);
        });
});