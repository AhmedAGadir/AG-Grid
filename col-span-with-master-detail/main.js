var columnDefs = [{
        field: 'name',
        rowSpan: params => {
            console.log(params.node.rowIndex % 5)
            return params.node.rowIndex % 5 === 0 ? 5 : null
        },
        cellClassRules: {
            "cell-span-red": "true",
            "center-button": "true"
        },
        cellRenderer: params => {
            if (params.node.rowIndex % 5 == 0) {
                let button = document.createElement('button')
                button.textContent = 'Toggle Master/Detail'
                button.addEventListener('click', () => toggle(params));
                return button
            }
            return params.value
        }
    },
    {
        field: 'account',
        colSpan: params => 2,
        rowSpan: params => params.node.rowIndex % 5 === 0 ? 5 : null,
        cellClassRules: {
            "cell-span-blue": "true"
        },
        valueFormatter: () => '',
    },
    {
        field: 'calls'
    },
    {
        field: 'minutes',
        valueFormatter: "x.toLocaleString() + 'm'"
    }
];

var gridOptions = {
    suppressRowTransform: true, // For row spanning to work
    columnDefs: columnDefs,
    masterDetail: true,
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
    onFirstDataRendered(params) {
        params.api.sizeColumnsToFit();
    }
}


function toggle(params) {
    // must specifify which row you would like to open the detail for
    let nodeId = params.node.rowIndex + 4
    let fifthRow = params.api.getRowNode(nodeId)
    fifthRow.setExpanded(!fifthRow.expanded)
}

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    // do http request to get our sample data - not using any framework to keep the example self contained.
    // you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
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
            console.log(arr)
            gridOptions.api.setRowData(arr);
        }
    };
});