function MyCustomHeader() {}

MyCustomHeader.prototype.init = function (params) {
    console.log('init', params);
    this.eGui = document.createElement('div');
    this.eGui.classList.add('customHeader');
    this.eGui.innerHTML = '**' + params.displayName;
};

MyCustomHeader.prototype.getGui = function () {
    return this.eGui;
};

// specify the columns
var columnDefs = [
    {
        headerName:
            '[GROUP] Lorem ipsum dolor, sit amet consectetur adipisicing elit. Distinctio neque sapiente iure, aliquid nemo eius incidunt assumenda dolores',
        headerGroupComponent: 'myCustomHeader',
        children: [
            {
                headerName:
                    '[CHILD] Lorem ipsum dolor, sit amet consectetur adipisicing elit. Distinctio',
                field: 'text',
            },
            {
                headerName:
                    '[CHILD] Lorem ipsum dolor, sit amet consectetur adipisicing elit. Distinctio Lorem ipsum dolor, sit amet consectetur adipisicing elit. Distinctio',
                field: 'text',
            },
        ],
    },
    {
        headerName:
            '[CHILD] Lorem ipsum dolor, sit amet consectetur adipisicing elit. Distinctio neque sapiente iure, aliquid nemo eius incidunt assumenda dolores, numquam cupiditate officiis similique aut consequuntur optio omnis nam quas id quidem.',
        field: 'val',
    },
    {
        headerName:
            '[CHILD] Lorem ipsum dolor, sit amet consectetur adipisicing elit.',
        field: 'text2',
    },
];

// specify the data
var rowData = [
    {
        val: 0,
        text: 'Foo',
        text2: 'The quick brown fox jumps over the lazy dog',
    },
    {
        val: 1,
        text: 'Bar',
        text2: 'The quick brown fox jumps over the lazy dog',
    },
    {
        val: 2,
        text: 'Baz',
        text2: 'The quick brown fox jumps over the lazy dog',
    },
];

// let the grid know which columns and what data to use
var gridOptions = {
    columnDefs: columnDefs,
    defaultColDef: {
        headerComponent: 'myCustomHeader',
        headerGroupComponent: 'myCustomHeader',
        resizable: true,
    },
    rowData: rowData,
    onGridReady: function (params) {
        params.api.sizeColumnsToFit();
    },
    components: {
        myCustomHeader: MyCustomHeader,
    },
    onColumnResized: function (params) {
        if (!params.finished) return;

        let centerHeaderContainer = params.api.gridPanel.headerRootComp.getHeaderContainers().get('center');

        let columnComps = Object.values(centerHeaderContainer.columnsRowComp.headerComps).map(colComp => colComp.headerCompGui);

        let groupsRowComps = Object.values(centerHeaderContainer.groupsRowComps[0].headerComps).map(comp => comp.eGui.children[1]);

        let tallestColumnComp = getTallestElem(columnComps);
        let tallestGroupsRowComp = getTallestElem(groupsRowComps);

        console.log('tallestColumnComp', tallestColumnComp);
        console.log('tallestGroupsRowComp', tallestGroupsRowComp);

        function getTallestElem(elemArr) {
            let tallestHeaderHeight = 0;
            elemArr.forEach(function (elem) {
                if (elem.clientHeight > tallestHeaderHeight) {
                    tallestHeaderHeight = elem.clientHeight;
                }
            });
            return tallestHeaderHeight;
        }

        // set header height
        const headerPadding = 14; // 14px;

        params.api.setGroupHeaderHeight(headerPadding + tallestGroupsRowComp);
        params.api.setHeaderHeight(headerPadding + tallestColumnComp);
    },
};

// wait for the document to be loaded, otherwise
// ag-Grid will not find the div in the document.
document.addEventListener('DOMContentLoaded', function () {
    // lookup the container we want the Grid to use
    var eGridDiv = document.querySelector('#myGrid');

    // create the grid passing in the div to use together with the columns & data we want to use
    new agGrid.Grid(eGridDiv, gridOptions);
});
