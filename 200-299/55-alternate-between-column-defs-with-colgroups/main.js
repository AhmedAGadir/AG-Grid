const state = {
    columnDefs: null,
};

function setColDefsA() {
    state.columnDefs = getColDefsA();
    gridOptions.api.setColumnDefs(state.columnDefs);
}

function setColDefsB() {
    state.columnDefs = getColDefsB();
    gridOptions.api.setColumnDefs(state.columnDefs);
}

function getColDefsA() {
    return [
        {
            headerName: 'Athlete',
            field: 'athlete',
            width: 150,
            filter: 'agTextColumnFilter',
            colId: 'athlete',
        },
        {
            headerName: 'Age',
            field: 'age',
            width: 90,
            filter: 'agNumberColumnFilter',
            colId: 'age',
        },
        {
            headerName: 'Country',
            field: 'country',
            width: 120,
            colId: 'country',
        },
        { headerName: 'Sport', field: 'sport', width: 110, colId: 'sport' },
        {
            headerName: 'Header Group 1',
            groupId: 'group1',
            children: [
                {
                    headerName: 'Total',
                    field: 'total',
                    width: 110,
                    colId: 'total',
                },
                {
                    headerName: 'Header Group 2',
                    groupId: 'group2',
                    children: [
                        {
                            headerName: 'Gold',
                            field: 'gold',
                            width: 100,
                            filter: 'agNumberColumnFilter',
                            colId: 'gold',
                        },
                        {
                            headerName: 'Silver',
                            field: 'silver',
                            width: 100,
                            filter: 'agNumberColumnFilter',
                            colId: 'silver',
                        },
                        {
                            headerName: 'Bronze',
                            field: 'bronze',
                            width: 100,
                            filter: 'agNumberColumnFilter',
                            colId: 'bronze',
                        },
                    ],
                },
            ],
        },
    ];
}

function getColDefsB() {
    return [
        {
            headerName: 'Athlete',
            field: 'athlete',
            width: 150,
            filter: 'agTextColumnFilter',
            colId: 'athlete',
        },
        {
            headerName: 'Age',
            field: 'age',
            width: 90,
            filter: 'agNumberColumnFilter',
            colId: 'age',
        },
        {
            headerName: 'Country',
            field: 'country',
            width: 120,
            colId: 'country',
        },
        { headerName: 'Sport', field: 'sport', width: 110, colId: 'sport' },
        {
            headerName: 'Header Group 1',
            groupId: 'group1',
            children: [
                {
                    headerName: 'Total',
                    field: 'total',
                    width: 110,
                    colId: 'total',
                },
                {
                    headerName: 'Gold',
                    field: 'gold',
                    width: 100,
                    filter: 'agNumberColumnFilter',
                    colId: 'gold',
                },
                {
                    headerName: 'Silver',
                    field: 'silver',
                    width: 100,
                    filter: 'agNumberColumnFilter',
                    colId: 'silver',
                },
                {
                    headerName: 'Bronze',
                    field: 'bronze',
                    width: 100,
                    filter: 'agNumberColumnFilter',
                    colId: 'bronze',
                },
            ],
        },
    ];
}

var gridOptions = {
    defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true,
    },
    columnDefs: state.columnDefs,
    deltaColumnMode: true,
    rowData: null,
    onGridReady: params => {
        setColDefsA();
    },
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    agGrid
        .simpleHttpRequest({
            url:
                'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json',
        })
        .then(function (data) {
            gridOptions.api.setRowData(data);
        });
});
