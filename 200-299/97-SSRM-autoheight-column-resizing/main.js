const store = {
    columnDefs: [
        {
            field: 'name',
            colId: 'name',
            width: 80,
        },
        {
            field: 'autoA',
            colId: 'autoA',
            cellClass: 'cell-wrap-text',
            autoHeight: true,
            width: 300,
        },
        {
            field: 'autoB',
            colId: 'autoB',
            cellClass: 'cell-wrap-text',
            autoHeight: true,
            width: 300,
        },
        {
            field: 'autoC',
            colId: 'autoC',
            cellClass: 'cell-wrap-text',
            autoHeight: true,
            width: 300,
        },
    ],
};

var gridOptions = {
    defaultColDef: {
        width: 100,
        resizable: true,
    },
    onColumnResized: params => {
        if (params.finished) {
            let updatedColumnDefs = store.columnDefs.map(col => {
                if (col.colId === params.column.colId) {
                    return {
                        ...col,
                        width: params.column.actualWidth
                    }
                } else {
                    return {...col}
                }
            });
            store.columnDefs = updatedColumnDefs;
            params.api.setColumnDefs(store.columnDefs);
            params.api.purgeServerSideCache();
        }
    },
    columnDefs: store.columnDefs,
    deltaColumnMode: true,
    rowModelType: 'serverSide',
    animateRows: true,
    serverSideDatasource: createSimpleDatasource(),
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
});

function createRowData() {
    var latinSentence =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum';
    var latinWords = latinSentence.split(' ');

    var rowData = [];

    function generateRandomSentence(row, col) {
        var wordCount = ((row + 1) * (col + 1) * 733 * 19) % latinWords.length;
        var parts = [];
        for (var i = 0; i < wordCount; i++) {
            parts.push(latinWords[i]);
        }
        var sentence = parts.join(' ');
        return sentence + '.';
    }

    // create 100 rows
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 50; j++) {
            var childItem = {
                name: 'Row ' + j,
                autoA: generateRandomSentence(i * j, 1),
                autoB: generateRandomSentence(i * j, 2),
                autoC: generateRandomSentence(i * j, 3),
            };
            rowData.push(childItem);
        }
    }

    return rowData;
}

function createSimpleDatasource() {
    function SimpleDatasource() {
        this.rowData = createRowData();
    }

    SimpleDatasource.prototype.getRows = function(params) {
        var groupKeys = params.request.groupKeys;
        var topLevel = groupKeys.length === 0;

        var listToReturn;
        if (topLevel) {
            listToReturn = this.rowData;
        } else {
            var groupKey = groupKeys[0];
            this.rowData.forEach(function(data) {
                if (data.group === groupKey) {
                    listToReturn = data.children;
                }
            });
        }

        var sectionToReturn = listToReturn.slice(
            params.request.startRow,
            params.request.endRow
        );

        setTimeout(() => {
            params.successCallback(sectionToReturn, listToReturn.length);
        }, 200);
    };

    return new SimpleDatasource();
}
