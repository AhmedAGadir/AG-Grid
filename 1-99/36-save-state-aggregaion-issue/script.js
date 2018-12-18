var columnDefs = [
    {
        headerName: '% Gold Metal',
        field: 'percentGold',
        sort: 'desc',
        // cellRenderer: percentGoldCellRenderer,
        cellStyle: {
            'text-align': 'left',
        },
        valueGetter: percentGoldValueGetter,
        valueFormatter: percentageFormatter,
        // aggFunc: percentGoldAggFunc,
        // comparator: percentGoldComparator,
    },
    {
        headerName: 'Gold',
        field: 'gold',
        width: 100,
        hide: false,
        aggFunc: 'sum',
    },
    { headerName: 'Total', field: 'total', width: 100, aggFunc: 'sum' },
    { headerName: 'Age', field: 'age', width: 90 },
    {
        headerName: 'Country',
        field: 'country',
        width: 120,
        enableRowGroup: true,
        rowGroupIndex: 0,
    },
    { headerName: 'Year', field: 'year', width: 90 },
    { headerName: 'Date', field: 'date', width: 110 },
    { headerName: 'Sport', field: 'sport', width: 110, rowGroupIndex: 1 },
    { headerName: 'Athlete', field: 'athlete', width: 150 },
    {
        headerName: 'Silver',
        field: 'silver',
        width: 100,
        hide: true,
        aggFunc: 'sum',
    },
    {
        headerName: 'Bronze',
        field: 'bronze',
        width: 100,
        hide: true,
        aggFunc: 'sum',
    },
];

var gridOptions = {
    groupSuppressAutoColumn: false,
    rowGroupPanelShow: 'always',
    showToolPanel: true,
    groupColumnDef: {
        headerName: 'Group',
        field: 'athlete',

        width: 275,
        cellRenderer: 'group',
        cellRendererParams: {
            footerValueGetter: '"Total (" + x + ")"',
            padding: 5,
        },
    },
    debug: true,
    columnDefs: columnDefs,
    rowData: null,
    enableSorting: true,
    enableColResize: true,

    onGridReady: function() {
        gridOptions.api.addGlobalListener(function(type, event) {
            if (type.indexOf('column') >= 0) {
                console.log('Got column event: ' + event);
            }
        });
    },
};

var savedState;

function printState() {
    var state = gridOptions.columnApi.getColumnState();
    console.log(state);
}

function saveState() {
    savedState = gridOptions.columnApi.getColumnState();
    console.log('column state saved');
}

function restoreState() {
    gridOptions.columnApi.setColumnState(savedState);

    // these next 3 lines don't work, but it seems like it would recompute % gold metals
    gridOptions.api.refreshInMemoryRowModel();
    gridOptions.api.recomputeAggregates();
    gridOptions.api.refreshView();
    console.log('column state restored -- sort of');
}

function resetState() {
    gridOptions.columnApi.resetColumnState();
}

function showAthlete(show) {
    gridOptions.columnApi.setColumnVisible('athlete', show);
}

function showMedals(show) {
    gridOptions.columnApi.setColumnsVisible(['gold', 'silver', 'bronze'], show);
}

function pinAthlete(pin) {
    gridOptions.columnApi.setColumnPinned('athlete', pin);
}

function pinAge(pin) {
    gridOptions.columnApi.setColumnPinned('age', pin);
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    // do http request to get our sample data - not using any framework to keep the example self contained.
    // you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', 'olympicWinners.json');
    httpRequest.send();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var httpResult = JSON.parse(httpRequest.responseText);
            gridOptions.api.setRowData(httpResult);
        }
    };
});

// function percentGoldCellRenderer(params) {

//             if ((params.value !== undefined) && (params.value !== null) && (typeof params.value.total === 'number') && (typeof params.value.total === 'number')) {
//                 return params.value.total !== 0 ? numeral((params.value.gold / params.value.total)).format('(0,0.0%)') : numeral(0).format('(0,0%)')
//             }
//             else {
//                 return numeral(0).format('(0,0%)')
//             }
//         }
function percentGoldValueGetter(params) {
    if (params.node.group) {
        return params.node.aggData.gold / params.node.aggData.total
    } else {
        return params.data.gold / params.data.total;
    }
}

function percentageFormatter(params) {
    return (params.value * 100).toFixed(1) + '%';
}

// function percentGoldAggFunc(values) {

//     //debugger;
//     var sum = {
//         gold: 0,
//         total: 0
//     }

//     //console.log(values);
//     values.forEach(
//         function (value) {

//             //console.log(value)
//             if (value !== null) {

//                     sum.gold += value.gold;
//                     sum.total += value.total;

//             }

//         });
//     return sum;
// }
// function percentGoldComparator(a, b) {
//     if (a && a.total !== 0) {
//         a = a.gold / a.total;
//     } else {
//         a = 0;
//     }

//     if (b && b.total !== 0) {
//         b = b.gold / b.total;
//     } else {
//         b = 0;
//     }

//     if (a > b) {
//         return 1;
//     } else if (a < b) {
//         return -1;
//     } else {
//         return 0;
//     }
// }
