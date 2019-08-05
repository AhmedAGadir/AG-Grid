var columnDefs = [
    { field: "foo" },
];

var gridOptions = {
    defaultColDef: {
        width: 240,
        resizable: true
    },
    autoGroupColumnDef: {
        cellRendererParams: {
            innerRenderer: function (params) {
                // display employeeName rather than group key (employeeId)
                return params.data.letter;
            }
        }
    },
    rowModelType: 'serverSide',
    treeData: true,
    columnDefs: columnDefs,
    animateRows: true,
    isServerSideGroup: function (dataItem) {
        // indicate if node is a group
        return dataItem.group;
    },
    getServerSideGroupKey: function (dataItem) {
        // debugger;
        // specify which group key to use
        return dataItem.id;
    },
    onGridReady: function (params) {
        // // initialise with the first group arbitrarily expanded

        // setTimeout(function () {
        //     params.api.getDisplayedRowAtIndex(0).setExpanded(true);
        // }, 1500);
        // setTimeout(function () {
        //     // expands second node
        //     params.api.getDisplayedRowAtIndex(1).setExpanded(true);
        // }, 2000);
    },
    cacheBlockSize: 10,
    maxBlocksInCache: 10
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    var data = createRowData();
    var fakeServer = createFakeServer(data);
    var datasource = createServerSideDatasource(fakeServer);
    gridOptions.api.setServerSideDatasource(datasource);
});

function createFakeServer(fakeServerData) {
    function FakeServer(allData) {
        this.data = allData;
    }

    FakeServer.prototype.getData = function (request) {
        // debugger;
        function extractRowsFromData(groupKeys, data) {
            if (groupKeys.length === 0) {
                return data.map(d => {
                    return {
                        group: !!d.children,
                        id: d.id,
                        letter: d.letter,
                        foo: d.foo
                    }
                });
            }

            var key = groupKeys[0];
            for (var i = 0; i < data.length; i++) {
                if (data[i].id === key) {
                    return extractRowsFromData(groupKeys.slice(1), data[i].children.slice());
                }
            }
        }

        return extractRowsFromData(request.groupKeys, this.data);
    };

    return new FakeServer(fakeServerData)
}

function createServerSideDatasource(fakeServer) {
    function ServerSideDatasource(fakeServer) {
        this.fakeServer = fakeServer;
    }

    ServerSideDatasource.prototype.getRows = function (params) {
        console.log('ServerSideDatasource.getRows: params = ', params);

        var rows = this.fakeServer.getData(params.request);
        // debugger;S

        setTimeout(function () {
            params.successCallback(rows, rows.length);
        }, 200);
    };

    return new ServerSideDatasource(fakeServer);
}


function createRowData() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let data = [];

    for (let i = 0; i < alphabet.length; i++) {
        let grandParent = {
            letter: alphabet[i],
            id: alphabet[i],
            children: [],
            foo: 'bar'
        };
        data.push(grandParent);
        for (let j = 0; j < alphabet.length; j++) {
            let parent = {
                letter: alphabet[j],
                id: [alphabet[i], alphabet[j]].join(''),
                children: [],
                foo: 'baz'
            };
            data[i].children.push(parent);
            for (let z = 0; z < alphabet.length; z++) {
                let child = {
                    letter: alphabet[z],
                    id: [alphabet[i], alphabet[j], alphabet[z]].join(''),
                    foo: 'foobar'
                };
                data[i].children[j].children.push(child)
            }
        }
    }
    return data;
}