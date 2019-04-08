
const state = {
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete', colId: 'athlete' },
        { headerName: 'Country', field: 'country', colId: 'country' },
        { headerName: 'Sport', field: 'sport', colId: 'sport' },
        { headerName: 'Age', field: 'age', colId: 'age' },
        { headerName: 'Year', field: 'year', colId: 'year' },
        { headerName: 'Date', field: 'date', colId: 'date' }
    ]
}

var gridOptions = {
    columnDefs: state.columnDefs,
    defaultColDef: {
        resizable: true,
        editable: true,
    },
    deltaColumnMode: true,
    rowData: null,
};

document.querySelector('select').addEventListener('change', event => {
    document.querySelectorAll('input[name="colChild"]').forEach((input, ind) => {
        input.disabled = ind + 1 > Number(event.target.value);
    });
})

document.querySelector('#myForm').addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const colGroup = formData.get('colGroup');
    const childColArr = formData.getAll('colChild');
    const newColGroup = {
        headerName: capitalize(colGroup),
        groupId: colGroup,
        children: childColArr.map(childCol => ({
            headerName: capitalize(childCol),
            field: childCol.toLowerCase(),
            colId: childCol.toLowerCase()
        }))
    };
    const newColumnDefs = state.columnDefs
        .map(colDef => ({
            ...colDef,
            children: colDef.children ? colDef.children.map(c => ({ ...c })) : undefined
        }))
        .concat(newColGroup);

    state.columnDefs = newColumnDefs;
    gridOptions.api.setColumnDefs(state.columnDefs);

});

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

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
