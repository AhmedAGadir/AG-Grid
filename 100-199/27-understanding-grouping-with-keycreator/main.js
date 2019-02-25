var gridOptions = {
    columnDefs: [
        {
            headerName: 'Age',
            field: 'age',
            rowGroup: true,
            keyCreator: params => {
                return params.value.ageRange
            },
            // valueGetter: params => params.node.group ? undefined : params.data.age.val,
            // valueFormatter: myValueFormatter,
            // cellRenderer: params => {
            //     if (params.node.group) {
            //         return;
            //     }
            //     return params.value.val
            // },
            // comparator: (valueA, valueB, nodeA, nodeB, isInverted) => {
            //     debugger
            // }
        },
        { headerName: 'Athlete', field: 'athlete' },
        { headerName: 'Country', field: 'country' },
        { headerName: 'Sport', field: 'sport' },

    ],
    autGroupColDef: {
    },
    defaultColDef: {
        width: 150,
        filter: true,
        sortable: true
    },
    rowData: null,
    onCellClicked: params => {
        // debugger
    }
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
    // debugger
    return params.value.val
    // return params.data.age;
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
            data = data.map(row => ({
                ...row,
                age: {
                    val: row.age,
                    ageRange: row.age < 25 ? 'Under 25' : row.age <= 30 ? '25 - 30' : 'Over 30'
                }
            }))
            gridOptions.api.setRowData(data);
        });
});
