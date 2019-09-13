var columnDefs = [
    {headerName: 'Athlete', field: 'athlete', width: 200},
    {headerName: 'Age', field: 'age', width: 90},
    {headerName: 'Gold', field: 'gold', width: 100, type: 'number'},
    {headerName: 'Silver', field: 'silver', width: 100, type: 'number'},
    {headerName: 'Bronze', field: 'bronze', width: 100, type: 'number'},
    {headerName: 'Country', field: 'country', width: 120, rowGroup: true},
    {headerName: 'Year', field: 'year', width: 90, filter: true},
    {headerName: 'Date', field: 'date', width: 110},
    {headerName: 'Sport', field: 'sport', width: 110}
];

var gridOptions = {
    columnTypes: {
        'number': {
            editable: true,
            // editing works with strings, need to change string to number
            valueParser: function(params) {
                return parseInt(params.newValue);
            },
            aggFunc: 'sum'
        }
    },
    columnDefs: columnDefs,
    rowData: null,
    groupUseEntireRow: true,
    components: {
        groupRowInnerRenderer: GroupRowInnerRenderer
    },
    groupRowInnerRenderer: 'groupRowInnerRenderer',
    groupRowRendererParams: {
        flagCodes: {
            Ireland: 'ie',
            'United States': 'us',
            Russia: 'ru',
            Australia: 'au',
            Canada: 'ca',
            Norway: 'no',
            China: 'cn',
            Zimbabwe: 'zw',
            Netherlands: 'nl',
            'South Korea': 'kr',
            Croatia: 'hr',
            France: 'fr'
        }
    }
};

function getDaTing() {
    // different ways to access the group row inner renderer 
    // 1) - reaching into the api
    // gridOptions.api.rowRenderer.rowCompsByIndex[0].fullWidthRowComponent
    // 2) - reaching into the api
    // gridOptions.api.rowRenderer.rowCompsByIndex[0].getFullWidthRowElement().querySelector('select').selectedIndex = 2
    // 3) - using events 
    gridOptions.api.dispatchEvent({
        type: 'myCustomEvent',
        ind: 0,
        removeFunc: (element) => element.style.display = 'none'
    })
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    // do http request to get our sample data - not using any framework to keep the example self contained.
    // you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json');
    httpRequest.send();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            var httpResult = JSON.parse(httpRequest.responseText);
            gridOptions.api.setRowData(httpResult);
        }
    };
});