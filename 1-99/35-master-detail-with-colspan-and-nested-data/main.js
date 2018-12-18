var columnDefs = [{
        field: 'isVisible',
        hide: true
    },
    {
        field: 'name',
        cellClassRules: {
            "cell-span-darkgrey": "true",
            "center-button": "true"
        },
        cellRenderer: params => {
            let button = document.createElement('button')
            button.textContent = 'Toggle Master/Detail'
            button.addEventListener('click', () => {
                params.node.setExpanded(!params.node.expanded)
            });
            return button
        }
    },
    {
        headerName: '',
        colSpan: () => 2,
        cellClassRules: {
            "cell-span-grey": "true"
        },
    },
    {
        headerName: '',
    },
    {
        field: 'minutes',
        cellRenderer: params => getFiveRows(params)
    }
];

var gridOptions = {
    suppressRowTransform: true,
    columnDefs: columnDefs,
    enableFilter: true,
    masterDetail: true,
    getRowHeight: params => {
        var isDetailRow = params.node.detail;
        if (isDetailRow) {
            // console.log(params.data.children.length)
            return 500
        }
        return 5 * 25
    },
    detailCellRendererParams: {
        detailGridOptions: {
            columnDefs: [{
                    field: 'callId'
                },
                {
                    field: 'direction'
                },
                {
                    field: 'number'
                },
                {
                    field: 'duration',
                    valueFormatter: "x.toLocaleString() + 's'"
                },
                {
                    field: 'switchCode'
                }
            ],
            onFirstDataRendered(params) {
                params.api.sizeColumnsToFit();
            }
        },
        getDetailRowData: function (params) {
            params.successCallback(params.data.callRecords);
        }
    },
    onFirstDataRendered: params => {
        params.api.sizeColumnsToFit();
        params.api.setFilterModel({
            isVisible: {
                values: ["true"],
                filterType: "set"
            }
        })
    }
}


document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', 'https://raw.githubusercontent.com/ag-grid/ag-grid-docs/latest/src/javascript-grid-master-detail/simple/data/data.json');
    httpRequest.send();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            var httpResult = JSON.parse(httpRequest.responseText);
            let arr = [];
            for (let i = 0; i < 5; i++) {
                arr = arr.concat(httpResult.slice(0))
            }
            arr.forEach((obj, ind) => {
                obj.isVisible = ind % 5 === 0
            })
            gridOptions.api.setRowData(arr);
        }
    };
});


function getFiveRows(params) {
    let div = document.createElement('div');
    div.classList.add('innerGrid')
    div.style.height = '100%';

    let secondGridOptions = {
        columnDefs: [{
            field: 'minutes'
        }],
        getRowHeight: () => 25,
        onFirstDataRendered: params => {
            params.api.setHeaderHeight(0)
            params.api.sizeColumnsToFit();
        }
    }

    let data = [];
    let index = params.node.rowIndex;
    let x = 0;
    while (x < 5) {
        data = data.concat([{
            minutes: 23
        }])
        // console.log(index)
        index++
        x++
    }


    new agGrid.Grid(div, secondGridOptions);
    setTimeout(() => secondGridOptions.api.setRowData(data), 1000);
    return div
}