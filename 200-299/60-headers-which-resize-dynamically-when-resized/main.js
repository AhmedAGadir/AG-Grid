// specify the columns
var columnDefs = [
    {headerName: "Text", field: "text"},
    {headerName: "Value", field: "val"},
    {headerName: "The quick brown fox jumps over the lazy dog", field: "text2"}
];

// specify the data
var rowData = [
    {val: 0, text: "Foo", text2: "The quick brown fox jumps over the lazy dog"},
    {val: 1, text: "Bar", text2: "The quick brown fox jumps over the lazy dog"},
    {val: 2, text: "Baz", text2: "The quick brown fox jumps over the lazy dog"}
];

// let the grid know which columns and what data to use
var gridOptions = {
    columnDefs: columnDefs,
    defaultColDef: {
        headerComponent: 'myCustomHeader',
        resizable: true
    },
    rowData: rowData,
    // headerHeight: 80,
    onGridReady: function (params) {
        params.api.sizeColumnsToFit();
    },
    components: {
        myCustomHeader: MyCustomHeader
    },
    onColumnResized: params => {
        if (!params.finished) {
            return;
        }
        let path = params.api.gridPanel.headerRootComp.childContainers[0].headerRowComps[0].headerComps
        let headerComponents = Object.keys(path).map(key => path[key].childComponents[1]);
        
        let tallestHeader = 0;
        headerComponents.forEach(headerComp => {
            if (headerComp.eGui.clientHeight > tallestHeader) {
                tallestHeader = headerComp.eGui.clientHeight;
            }
        })
        const headerPadding = 14 // 14px;
        params.api.setHeaderHeight(tallestHeader + headerPadding);
    }
};

// wait for the document to be loaded, otherwise
// ag-Grid will not find the div in the document.
document.addEventListener("DOMContentLoaded", function() {

    // lookup the container we want the Grid to use
    var eGridDiv = document.querySelector('#myGrid');

    // create the grid passing in the div to use together with the columns & data we want to use
    new agGrid.Grid(eGridDiv, gridOptions);
});

function MyCustomHeader() {}

MyCustomHeader.prototype.init = function(params) {
    this.eGui = document.createElement('div');
    this.eGui.classList.add('customHeader')
    this.eGui.innerHTML = params.displayName;
}

MyCustomHeader.prototype.getGui = function() {
    return this.eGui;
}