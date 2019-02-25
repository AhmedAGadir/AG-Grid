var gridOptions = {
    columnDefs: [
        {
            headerName: 'Age',
            field: 'age',
            rowGroup: true,
            valueGetter: myValueGetter,
            valueFormatter: myValueFormatter,
            comparator: (valueA, valueB, nodeA, nodeB, isInverted) => {
                if (nodeA.group || nodeB.group) {
                    return nodeA;
                }
                return nodeA.data.age - nodeB.data.age;
            }
        },
        { headerName: 'Athlete', field: 'athlete' },
        { headerName: 'Country', field: 'country' },
        { headerName: 'Sport', field: 'sport' },

    ],
    autGroupColDef: {
    },
    defaultColDef: {
        width: 150,
        sortable: true
    },
    rowData: null
};

function myValueGetter(params) {
    if (params.node.group) {
        return;
    }
    const age = params.data.age;
    if (age < 25) {
        return 'Under 25';
    } else if (age <= 30) {
        return '25 - 30';
    } else {
        return 'Over 30';
    }
}

function myValueFormatter(params) {
    if (params.node.group) {
        return;
    }
    return params.data.age;
}

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    agGrid
        .simpleHttpRequest({
            url:
                'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json',
        })
        .then(function (data) {
            data = data.filter(row => row.age !== null);
            gridOptions.api.setRowData(data);
        });
});
