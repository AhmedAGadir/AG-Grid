
const gridOptions = {
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete' },
        // { headerName: 'Age', field: 'age' },
        // { headerName: 'Date', field: 'date' },
        { headerName: 'Gold', field: 'gold', cellRenderer: 'footerCellRenderer' },
        { headerName: 'Silver', field: 'silver', cellRenderer: 'footerCellRenderer' },
        { headerName: 'Bronze', field: 'bronze', cellRenderer: 'footerCellRenderer' },
        // { headerName: 'Total', field: 'total' },
        { headerName: 'Country', field: 'country', enableRowGroup: true, rowGroup: true, valueFormatter: groupedFooterValueFormatter },
        { headerName: 'Sport', field: 'sport', enableRowGroup: true, rowGroup: true, valueFormatter: groupedFooterValueFormatter },
        { headerName: 'Year', field: 'year', enableRowGroup: true, valueFormatter: groupedFooterValueFormatter },
    ],
    defaultColDef: {
        width: 150,
        filter: MyCustomFilter,
        sortable: true,
        comparator: (valA, valB, nodeA, nodeB, isInverted) => {
            if (nodeA.data && nodeA.data.isFooter || nodeB.data && nodeB.data.isFooter) {
                return 0;
            }
            return valA == valB ? 0 : valA > valB ? 1 : -1;
        },
        resizable: true
    },
    autoGroupColumnDef: {
        width: 250,
        cellRendererParams: {
            suppressCount: true
        }
    },
    rowData: null,
    components: {
        footerCellRenderer: FooterCellRenderer
    },
    getRowStyle: params => {
        if (!params.node.group && params.node.data.isFooter) {
            return {
                background: 'black',
                fontWeight: 'bold',
                color: 'white'
            }
        }
    },
    sideBar: true,
    rowGroupPanelShow: 'always',
    onFirstDataRendered: params => {
        addNewFooters();
        // params.api.forEachNode(node => {
        //     if (node.group && node.key === 'Russia' || node.group && node.key === 'Canoeing') {
        //         node.setExpanded(true);
        //     }
        // });
    },
    onColumnRowGroupChanged: () => {
        removeCurrentFooters();
        addNewFooters();
    },
    onFilterChanged: () => {
        removeCurrentFooters();
        addNewFooters();
    },
    onGridReady: params => {
        window.params = params // for debugging;
    }
};

document.addEventListener('DOMContentLoaded', function () {
    const gridDiv = document.querySelector('#myGrid');
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

function groupedFooterValueFormatter(params) {
    if (params.node.group) {
        return null;
    }
    return params.data.isFooter ? '' : params.value
}

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
            rows.push(createFooterRow(combination, rowGroups, 'Minimum'));
            rows.push(createFooterRow(combination, rowGroups, 'Maximum'));
            rows.push(createFooterRow(combination, rowGroups, 'Total'));
            return rows;
        })
        .reduce((rows, row) => [...rows, ...row]);
    // update the grid
    let rowsUpdate = gridOptions.api.updateRowData({
        add: newFooterRows
    });
    console.log(rowsUpdate);
}

function createFooterRow(combination, rowGroups, text) {
    let row = {};
    combination.split('%').forEach((field, ind) => {
        row[rowGroups[ind]] = field;
    });
    row.isFooter = true;
    row.athlete = text;
    return row;
}