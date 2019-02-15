
const gridOptions = {
    columnDefs: [
        {
            field: 'athlete',
            type: 'textColumn',
            valueFormatter: params => {
                if (params.data && params.data.isFooter) {
                    return params.data.athlete
                }
            }
        },
        {
            field: 'gold',
            type: ['numberColumn', 'aggregatable']
        },
        {
            field: 'silver',
            type: ['numberColumn', 'aggregatable']
        },
        {
            field: 'bronze',
            type: ['numberColumn', 'aggregatable']
        },
        {
            field: 'country',
            rowGroup: true,
            type: ['textColumn', 'groupable']
        },
        {
            field: 'sport',
            rowGroup: true,
            type: ['textColumn', 'groupable']
        },
        {
            field: 'year',
            type: ['numberColumn', 'groupable']
        },
    ],
    columnTypes: {
        textColumn: {
            filter: 'agTextColumnFilter',
            valueGetter: textColumnValueGetter
        },
        numberColumn: {
            filter: 'agNumberColumnFilter',
            valueGetter: numberColumnValueGetter
        },
        groupable: {
            enableRowGroup: true,
            valueFormatter: groupedFooterValueFormatter,
        },
        aggregatable: {
            cellRenderer: 'footerCellRenderer'
        }
    },
    defaultColDef: {
        width: 150,
        filterParams: {
            suppressAndOrCondition: true,
            debounceMs: 500
        },
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
        if (params.node.data && params.node.data.isFooter) {
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
        //     if (node.group && node.key === 'Japan' || node.group && node.key === 'Wrestling') {
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

function transformStrToNotEqual(str) {
    return str
        .split('')
        .map(char => String.fromCharCode(char.charCodeAt(0) + 1))
        .join('');
}

function textColumnValueGetter(params) {
    if (params.node.group) {
        return null;
    }
    const currentCol = params.colDef.field;
    if (params.data.isFooter) {
        let currentFilterModel = params.api.getFilterModel()[currentCol];
        if (currentFilterModel) {
            switch (currentFilterModel.type) {
                case 'contains': return currentFilterModel.filter;
                case 'notContains': return transformStrToNotEqual(currentFilterModel.filter);
                case 'startsWith': return currentFilterModel.filter;
                case 'endsWith': return currentFilterModel.filter;
                case 'equals': return currentFilterModel.filter;
                case 'notEqual': return transformStrToNotEqual(currentFilterModel.filter);
            }
        }
    }
    return params.data[currentCol];
}

function numberColumnValueGetter(params) {
    if (params.node.group) {
        return null;
    }
    const currentCol = params.colDef.field;
    if (params.data.isFooter) {
        let currentFilterModel = params.api.getFilterModel()[currentCol];
        if (currentFilterModel) {
            switch (currentFilterModel.type) {
                case 'equals': return currentFilterModel.filter;
                case 'lessThan': return currentFilterModel.filter - 1;
                case 'lessThanOrEqual': return currentFilterModel.filter - 1;
                case 'greaterThan': return currentFilterModel.filter + 1;
                case 'greaterThanOrEqual': return currentFilterModel.filter + 1;
                case 'notEqual': return currentFilterModel.filter + 1;
                case 'inRange': return (currentFilterModel.filter + currentFilterModel.filterTo) / 2
            }
        }
    }
    return params.data[currentCol];
}

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