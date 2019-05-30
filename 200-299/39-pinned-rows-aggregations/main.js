var columnDefs = [
    {
        headerName: 'Athlete',
        field: 'athlete',
        width: 100,
        colSpan: getColSpan,
    },
    {
        headerName: 'Year',
        field: 'year',
        width: 100
    },
    {
        headerName: 'Country',
        field: 'country',
        width: 100
    },
    {
        headerName: 'Gold',
        field: 'gold',
        width: 90,
    },
    {
        headerName: 'Silver',
        field: 'silver',
        width: 90,
    },
    {
        headerName: 'Bronze',
        field: 'bronze',
        width: 90,
    },
];

let allowRefresh = false;

function getColSpan(params) {
    return params.node.isRowPinned() ? 3 : 1;
}

function getCellStyle(params) {
    let rowPinned = params.node.isRowPinned();
    return {
        textAlign: rowPinned && params.column.colId === 'athlete' ? 'center' : null,
        background: params.column.colId === 'athlete' && rowPinned ? 'skyblue' : null
    }
}

function getPinnedBottomRows(params) {
    let bottomRowPinnedRows = [
        { athlete: 'Total', gold: null, silver: null, bronze: null },
        { athlete: 'Max', gold: null, silver: null, bronze: null },
        { athlete: 'Min', gold: null, silver: null, bronze: null }
    ];

    params.api.forEachNodeAfterFilter((node, nodeInd) => {
        bottomRowPinnedRows.forEach(pinnedRow => {
            if (nodeInd === 0) {
                pinnedRow.gold = node.data.gold;
                pinnedRow.silver = node.data.silver;
                pinnedRow.bronze = node.data.bronze;
            }

            switch (pinnedRow.athlete) {
                case 'Total':
                    pinnedRow.gold += node.data.gold;
                    pinnedRow.silver += node.data.silver;
                    pinnedRow.bronze += node.data.bronze;
                    return;
                case 'Max':
                    pinnedRow.gold = node.data.gold > pinnedRow.gold ? node.data.gold : pinnedRow.gold;
                    pinnedRow.silver = node.data.silver > pinnedRow.silver ? node.data.silver : pinnedRow.silver;
                    pinnedRow.bronze = node.data.bronze > pinnedRow.bronze ? node.data.bronze : pinnedRow.bronze;
                    return;
                case 'Min':
                    pinnedRow.gold = node.data.gold < pinnedRow.gold ? node.data.gold : pinnedRow.gold;
                    pinnedRow.silver = node.data.silver < pinnedRow.silver ? node.data.silver : pinnedRow.silver;
                    pinnedRow.bronze = node.data.bronze < pinnedRow.bronze ? node.data.bronze : pinnedRow.bronze;
                    return;
            }
        })
    })

    params.api.setPinnedBottomRowData(bottomRowPinnedRows);
};



var gridOptions = {
    defaultColDef: {
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: getCellStyle
    },
    columnDefs: columnDefs,
    rowData: null,
    pinnedBottomRowData: null,
    onFirstDataRendered: getPinnedBottomRows,
    onFilterChanged: getPinnedBottomRows,
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
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
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            var httpResult = JSON.parse(httpRequest.responseText);
            gridOptions.api.setRowData(httpResult.slice(0, 50));

        }
    };
});
