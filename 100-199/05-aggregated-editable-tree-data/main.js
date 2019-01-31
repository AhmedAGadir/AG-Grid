// specify the columns
var columnDefs = [
    // we're using the auto group column by default!
    { field: "jobTitle" },
    { field: "target", editable: true, aggFunc: 'sum' }
];

// specify the data
var rowData = [
    { orgHierarchy: ['Erica Rogers'], jobTitle: "CEO", target: 0 },
    { orgHierarchy: ['Erica Rogers', 'Malcolm Barrett'], jobTitle: "Exec. Vice President", target: 0 },

    { orgHierarchy: ['Erica Rogers', 'Malcolm Barrett', 'Esther Baker'], jobTitle: "Director of Operations", target: 0 },
    { orgHierarchy: ['Erica Rogers', 'Malcolm Barrett', 'Esther Baker', 'Brittany Hanson'], jobTitle: "Fleet Coordinator", target: 0 },
    { orgHierarchy: ['Erica Rogers', 'Malcolm Barrett', 'Esther Baker', 'Brittany Hanson', 'Leah Flowers'], jobTitle: "Parts Technician", target: 0 },
    { orgHierarchy: ['Erica Rogers', 'Malcolm Barrett', 'Esther Baker', 'Brittany Hanson', 'Tammy Sutton'], jobTitle: "Service Technician", target: 0 },
    { orgHierarchy: ['Erica Rogers', 'Malcolm Barrett', 'Esther Baker', 'Derek Paul'], jobTitle: "Inventory Control", target: 0 },

    { orgHierarchy: ['Erica Rogers', 'Malcolm Barrett', 'Francis Strickland'], jobTitle: "VP Sales", target: 0 },
    { orgHierarchy: ['Erica Rogers', 'Malcolm Barrett', 'Francis Strickland', 'Morris Hanson'], jobTitle: "Sales Manager", target: 1 },
    { orgHierarchy: ['Erica Rogers', 'Malcolm Barrett', 'Francis Strickland', 'Todd Tyler'], jobTitle: "Sales Executive", target: 2 },
    { orgHierarchy: ['Erica Rogers', 'Malcolm Barrett', 'Francis Strickland', 'Bennie Wise'], jobTitle: "Sales Executive", target: 3 },
    { orgHierarchy: ['Erica Rogers', 'Malcolm Barrett', 'Francis Strickland', 'Joel Cooper'], jobTitle: "Sales Executive", target: 4 }
];

var gridOptions = {
    columnDefs: columnDefs,
    rowData: rowData,
    treeData: true, // enable Tree Data mode
    animateRows: true,
    groupDefaultExpanded: -1, // expand all groups by default
    // enableGroupEdit: true,
    getDataPath: function (data) {
        return data.orgHierarchy;
    },
    onGridReady: function (params) {
        params.api.sizeColumnsToFit();
    },
    autoGroupColumnDef: {
        headerName: "Organisation Hierarchy",
        cellRendererParams: {
            suppressCount: true
        }
    },
    // onCellValueChanged(cellValueChangeEvent){
    //   console.log(cellValueChangeEvent);
    //   alert('newValue: ' + cellValueChangeEvent.newValue.toString() +
    //   '\r\noldValue: ' + cellValueChangeEvent.oldValue.toString());

    //   //Always true for aggregated rows [Major Issue]
    //   if(cellValueChangeEvent.oldValue === cellValueChangeEvent.newValue){
    //     updateTargets(cellValueChangeEvent.node, +cellValueChangeEvent.newValue)
    //   }
    // },
    // groupRowAggNodes: function (nodes) {
    //     return { target: nodes.reduce((value, next) => value + (+next.data.target), 0) };
    // },
    onCellValueChanged: params => {
        params.api.refreshClientSideRowModel('aggregate');
    }

};

function updateTargets(node, value) {
    //Do call to service tp update values
}

document.addEventListener("DOMContentLoaded", function () {
    var eGridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(eGridDiv, gridOptions);
});