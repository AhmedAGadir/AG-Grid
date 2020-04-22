var gridOptions = {
  columnDefs: [
    {
        headerName: 'Athlete Details',
        children: [
            { headerName: 'Athlete', field: 'athlete' },
            { headerName: 'Age', field: 'age' },
            { headerName: 'Country', field: 'country' }
        ]
    },
    { headerName: 'Year', field: 'year' },
    { headerName: 'Date', field: 'date' },
    {
        headerName: 'Sports Results',
        children: [
            { headerName: 'Sport', field: 'sport' },
            { headerName: 'Total', columnGroupShow: 'closed', field: 'total' },
            { headerName: 'Gold', columnGroupShow: 'open', field: 'gold' },
            { headerName: 'Silver', columnGroupShow: 'open', field: 'silver' },
            { headerName: 'Bronze', columnGroupShow: 'open', field: 'bronze' }
        ]
    },
    { headerName: 'Year', field: 'year' },
    {
        headerName: 'Athlete Details',
        children: [
            { headerName: 'Athlete', field: 'athlete' },
            { headerName: 'Age', field: 'age' },
            { headerName: 'Country', field: 'country' }
        ]
    },
    { headerName: 'Date', field: 'date' },
    { headerName: 'Year', field: 'year' },
    { headerName: 'Date', field: 'date' } 
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  enableRangeSelection: true,
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);

  // do http request to get our sample data - not using any framework to keep the example self contained.
  // you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
  var httpRequest = new XMLHttpRequest();
  httpRequest.open(
    'GET',
    'https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/olympicWinnersSmall.json'
  );
  httpRequest.send();
  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === 4 && httpRequest.status === 200) {
      var httpResult = JSON.parse(httpRequest.responseText);
      gridOptions.api.setRowData(httpResult);
    }
  };
});
