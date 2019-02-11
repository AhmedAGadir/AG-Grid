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
        filter: MyCustomFilter,
        sortable: true,
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
    onFirstDataRendered: () => {
        addNewFooters();
    },
    onColumnRowGroupChanged: () => {
        removeCurrentFooters();
        addNewFooters();
    },
    onFilterChanged: () => {
        removeCurrentFooters();
        addNewFooters();
    },
    // postSort: postSort,
    getRowStyle: params => {
        if (!params.node.group && params.node.data.isFooter) {
            return {
                background: 'blue',
                fontWeight: 'bold',
                color: 'white'
            }
        }
    },
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

function removeCurrentFooters() {
    // store all current footers
    const currentFooterRows = [];
    gridOptions.api.forEachNode(node => {
        if (node.data && node.data.isFooter) {
            currentFooterRows.push(node.data);
        }
    });
    // update the grid
    const rowsUpdate = gridOptions.api.updateRowData({
        remove: currentFooterRows
    });
    console.log(rowsUpdate);
}

function addNewFooters() {
    // store all current row groups e.g. [Country, Year]
    const rowGroups = [];
    gridOptions.columnApi.getRowGroupColumns().forEach(col => {
        rowGroups.push(col.colId);
    });
    // find all grouping combinations 
    const groupingCombinations = new Set();
    gridOptions.api.forEachNodeAfterFilter(node => {
        if (node.group) return;
        var store = [];
        rowGroups.forEach(rowGroup => {
            store.push(node.data[rowGroup]);
        });
        groupingCombinations.add(store.join('%'));
    })
    // create new footer rows
    const newFooterRows = [...groupingCombinations]
        .map(combination => {
            let rows = [];
            rows.push(createFooterRow(combination, rowGroups, 'first footer row'));
            rows.push(createFooterRow(combination, rowGroups, 'second footer row'));
            rows.push(createFooterRow(combination, rowGroups, 'third footer row'));
            return rows;
        })
        .reduce((rows, row) => [...rows, ...row]);
    // update the grid
    let rowsUpdate = gridOptions.api.updateRowData({
        add: newFooterRows
    });
    console.log(rowsUpdate);
}

function createFooterRow(combination, rowGroups, footerContent) {
    let row = {};
    combination.split('%').forEach((field, ind) => {
        row[rowGroups[ind]] = field;
    });
    row.isFooter = true;
    row.athlete = footerContent;
    return row;
}