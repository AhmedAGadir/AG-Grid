function createRowData() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let data = [];

    for (let i = 0; i < alphabet.length; i++) {
        for (let j = 0; j < alphabet.length; j++) {
            for (let z = 0; z < alphabet.length; z++) {
                data.push({
                    letters: [alphabet[i], alphabet[j], alphabet[z]],
                    foo: 'bar'
                })
            }
        }
    }
    console.log('length of data is', data.length);
    return data;
}

var gridOptions = {
    columnDefs: [
        { field: "foo" }
    ],
    rowData: null,
    treeData: true,
    animateRows: true,
    groupDefaultExpanded: -1,
    getDataPath: function (data) {
        return data.letters;
    },
    onGridReady: function (params) {
        params.api.sizeColumnsToFit();
    },
    // autoGroupColumnDef: {
    //     headerName: "Organisation Hierarchy",
    //     cellRendererParams: {
    //         suppressCount: true
    //     }
    // }
};

document.addEventListener("DOMContentLoaded", function () {
    var eGridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(eGridDiv, gridOptions);
    let rowData = createRowData();
    // console.time('setRowData');
    gridOptions.api.setRowData(rowData);
    // console.timeEnd('setRowData');
});