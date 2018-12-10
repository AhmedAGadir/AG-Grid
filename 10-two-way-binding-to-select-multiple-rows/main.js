var columnDefs = [
    {
        headerName: "selected", 
        field: "selected", 
        suppressToolPanel: true
    },
    {headerName: "Athlete", field: "athlete", width: 150},
    {headerName: "Age", field: "age", width: 90},
    {headerName: "Country", field: "country", width: 120},
    {headerName: "Year", field: "year", width: 90 },
    {headerName: "Date", field: "date", width: 110},
    {headerName: "Sport", field: "sport", width: 110},
    {headerName: "Gold", field: "gold", width: 100},
    {headerName: "Silver", field: "silver", width: 100},
    {headerName: "Bronze", field: "bronze", width: 100},
    {headerName: "Total", field: "total", width: 100}

];

var gridOptions = {
    columnDefs: columnDefs,
    enableSorting: true,
    rowSelection: 'multiple',
    onFirstDataRendered: params => initSelectedRows(),
    onCellClicked: params => selectRow(params),
    onCellValueChanged: params => updateSelectedData(params),
    onRowSelected: params => {
        if (params.node.selected !== params.node.data.selected) {
            params.node.setDataValue('selected', params.node.selected);
        }
    }
};

function initSelectedRows() {
    gridOptions.api.forEachNode( node => {
        node.setSelected(node.data.selected)
    })
}

function selectRow(params) {
    params.node.setDataValue('selected', !params.data.selected);
 }


function updateSelectedData(params) {
    params.node.setSelected(params.data.selected);
    //initSelectedRows();
}

function randy() {
  return Math.random() < 0.5;
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    // do http request to get our sample data - not using any framework to keep the example self contained.
    // you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', 'https://raw.githubusercontent.com/ag-grid/ag-grid-docs/master/src/olympicWinnersSmall.json');
    httpRequest.send();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {

            var httpResult = JSON.parse(httpRequest.responseText);
            httpResult.map((obj) => {
              obj.selected = randy ();
              return obj;
            });
            gridOptions.api.setRowData(httpResult);
            
        }
    };
});