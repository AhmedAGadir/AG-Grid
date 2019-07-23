var columnDefs = [
    {
        field: 'country',
        width: 120,
        rowGroup: true,
        hide: true,
    },
    {
        headerName: 'avg(Gold)',
        field: 'gold',
        width: 120,
        enableValue: true,
        aggFunc: 'avg',
        valueFormatter: numberFormatter
    },
    {
        headerName: 'myAvg(Gold)',
        field: 'gold',
        width: 120,
        enableValue: true,
        aggFunc: myAggFunc,
        valueFormatter: numberFormatter
    },
];

function numberFormatter(params) {
    if (params.node.group) {
        return typeof params.value === 'number' ? params.value.toFixed(1) : params.value.value.toFixed(1);
    } else {
        return params.value;
    }
}

var gridOptions = {
    columnDefs: columnDefs,
    rowData: null,
    suppressAggFuncInHeader: true
};

function myAggFunc(values) {
    if (values.length === 0) {
        return
    }
    let total = 0;
    let count = 0;
    values.forEach(val => {
        if (val > 0) {
            total += val;
            count++;
        }
    });
    return count === 0 ? 0 : total/count;
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    // do http request to get our sample data - not using any framework to keep the example self contained.
    // you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
    var httpRequest = new XMLHttpRequest();
    httpRequest.open(
        'GET',
        'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json'
    );
    httpRequest.send();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            var httpResult = JSON.parse(httpRequest.responseText);
            gridOptions.api.setRowData(httpResult.slice(0,100));
        }
    };
});
