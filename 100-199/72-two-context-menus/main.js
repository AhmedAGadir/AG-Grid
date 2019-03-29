var columnDefs = [
    { headerName: 'Athlete', field: 'athlete', width: 150, cellRenderer: 'athleteCellRenderer' },
    { headerName: 'Age', field: 'age', width: 90 },
    { headerName: 'Country', field: 'country', width: 120 },
    { headerName: 'Year', field: 'year', width: 90 },
    { headerName: 'Date', field: 'date', width: 110 },
    { headerName: 'Sport', field: 'sport', width: 110 },
    { headerName: 'Gold', field: 'gold', width: 100 },
    { headerName: 'Silver', field: 'silver', width: 100 },
    { headerName: 'Bronze', field: 'bronze', width: 100 },
    { headerName: 'Total', field: 'total', width: 100 }
];

var gridOptions = {
    columnDefs: columnDefs,
    enableRangeSelection: true,
    getContextMenuItems: getContextMenuItems,
    allowContextMenuWithControlKey: true,
    components: {
        athleteCellRenderer: AthleteCellRenderer
    }
};

function getContextMenuItems(params) {
    if (typeof params.value === 'object' && params.value.fromEllipses) {
        return [{ name: 'Menu B', action: () => { console.log(params.value.val) } }, , 'separator', 'paste', 'export']
    }
    return [{ name: 'Menu A', action: () => { console.log(params.value) } }, 'separator', 'copy', 'copyWithHeaders']
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    // do http request to get our sample data - not using any framework to keep the example self contained.
    // you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json');
    httpRequest.send();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var httpResult = JSON.parse(httpRequest.responseText);
            gridOptions.api.setRowData(httpResult);
        }
    };
});

function AthleteCellRenderer() { }

AthleteCellRenderer.prototype.init = function (params) {
    this.eGui = document.createElement('div');
    this.eGui.className = 'athlete-cell-renderer';

    let span = document.createElement('span');
    span.textContent = params.value;
    this.eGui.appendChild(span);

    let icon = document.createElement('icon');
    icon.addEventListener('click', event => {
        params.api.contextMenuFactory.hideActiveMenu();
        // params.api.contextMenuFactory.showMenu(params.node, params.column, params.value, event);
        // pass an object instead of the value
        params.api.contextMenuFactory.showMenu(params.node, params.column, { val: params.value, fromEllipses: true }, event);
    });
    icon.className = "fas fa-ellipsis-v";
    this.eGui.appendChild(icon);
}

AthleteCellRenderer.prototype.getGui = function () {
    return this.eGui;
}