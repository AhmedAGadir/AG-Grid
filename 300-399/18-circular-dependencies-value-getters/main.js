var updatingF2 = false;
var updatingF3 = false;

var columnDefs = [
    { field: 'f1', editable: false,  },
    {
        field: 'f2',
        valueGetter: function(params) {
            if (updatingF3) {
                params.data.f2 = params.data.f3 - params.data.f1;
            }
            updatingF3 = false;
            return params.data.f2;
        },
        valueSetter: params => {
            params.data.f2 = Number(params.newValue);
            updatingF2 = true;
            return true;
        },
    },
    {
        field: 'f3',
        valueGetter: function(params) {
            if (updatingF2) {
                params.data.f3 = params.data.f1 + params.data.f2;
            }
            updatingF2 = false;
            return params.data.f3;
        },
        valueSetter: params => {
            params.data.f3 = Number(params.newValue);
            updatingF3 = true;
            return true;
        },
    },
];

var gridOptions = {
    defaultColDef: {
        editable: true,
        flex: 1,
        type: 'numericColumn'
    },
    columnDefs: columnDefs,
    rowData: [{ f1: 2 }],
    onCellValueChanged: params => {
        // the old code didn't update the underlying data
        console.log(params.api.getRowNode(0).data);
    },
    rowClassRules: {
        'green-highlight': function(params) {
            return params.data.f2 > 0;
        },
        'no-highlight': function(params) {
            return params.data.f2 <= 0;
        },
    },
};

document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
});
