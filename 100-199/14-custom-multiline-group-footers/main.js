// whenever filtering, sorting, or grouping happens - remove all metarows, [filter|sort]?, add new metarows 

var gridOptions = {
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete' },
        { headerName: 'Country', field: 'country', enableRowGroup: true, rowGroup: true },
        { headerName: 'Sport', field: 'sport', enableRowGroup: true },
        { headerName: 'Age', field: 'age' },
        { headerName: 'Year', field: 'year', enableRowGroup: true },
        { headerName: 'Date', field: 'date' },
        { headerName: 'Gold', field: 'gold' },
        { headerName: 'Silver', field: 'silver' },
        { headerName: 'Bronze', field: 'bronze' },
    ],
    defaultColDef: {
        width: 150,
        resizable: true
    },
    autoGroupColumnDef: {
        cellRendererParams: {
            suppressCount: true
        }
    },
    rowData: null,
    sideBar: true,
    rowGroupPanelShow: 'always',
    onFirstDataRendered: updateRowGroupFooters,
    onColumnRowGroupChanged: updateRowGroupFooters,
    getRowStyle: params => {
        if (!params.node.group && params.node.data.isFooter) {
            return {
                background: 'blue',
                fontWeight: 'bold',
                color: 'white'
            }
        }
    }
};

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

function updateRowGroupFooters(params) {
    // remove old footers 
    let oldFooterRows = getCurrentFooters(params);
    let removedFooters = params.api.updateRowData({
        remove: oldFooterRows
    });
    console.log(removedFooters);

    // add new footers
    let rowGroups = [];
    params.columnApi.getRowGroupColumns().forEach(col => {
        rowGroups.push(col.colId);
    });
    let newFooterRows = createFooters(params, rowGroups);
    let addedFooters = params.api.updateRowData({
        add: newFooterRows
    });
    console.log(addedFooters);
}

function getCurrentFooters(params) {
    let store = [];
    params.api.forEachNode(node => {
        if (node.data && node.data.isFooter) {
            store.push(node.data);
        }
    });
    return store;
}

function createFooters(params, rowGroups) {
    let combinations = new Set();
    params.api.forEachNode(node => {
        if (node.group) return;
        var store = []
        rowGroups.forEach(rowGroup => {
            store.push(node.data[rowGroup])
        });
        combinations.add(store.join('%'))
    })

    let result = [...combinations].map(combination => {
        let row = {};
        combination.split('%').forEach((field, ind) => {
            row[rowGroups[ind]] = field;
        });
        row.isFooter = true;
        row.athlete = 'This is a footer';
        return row;
    });
    return result;
}
