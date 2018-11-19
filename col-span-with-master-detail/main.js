var columnDefs = [
    // group cell renderer needed for expand / collapse icons
    {
        field: 'rowNumber',
        // cellRenderer: 'agGroupCellRenderer',
        rowSpan: (({
            node
        }) => {
            let rowIndex = node.rowIndex;
            return rowIndex == 0 ? 5 : false;
        }),
        cellClassRules: {
            "cell-span-red": "true",
            "center-button": "true"
        },
        cellRenderer: params => {
            let button = document.createElement('button')
            button.textContent = 'Toggle Master/Detail'
            button.addEventListener('click', () => toggle(params));
            return button
        }
    },
    {
        field: 'name',
        colSpan: () => 2,
        rowSpan: ({
            node
        }) => {
            let rowIndex = node.rowIndex;
            return rowIndex == 0 ? 5 : false;
        },
        cellClassRules: {
            "cell-span-blue": "true"
        },
        valueFormatter: () => '',
    },
    {
        field: 'account'
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
            getDetailRowData: function (params) {
                params.successCallback(params.data.callRecords);
            },
        }
    },
    columnDefs: columnDefs,

};

function toggle(params) {
    console.log(params.node.expanded);
    params.node.expanded = !params.node.expanded
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
            var count = 0;
            httpResult.map((obj) => {
                obj.rowNumber = count++;
                return obj;
            });
            gridOptions.api.setRowData(httpResult);
        }
    };
});