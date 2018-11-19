var columnDefs = [{
        headerName: "a",
        field: "a",
        rowSpan: ({
            node
        }) => {
            let rowIndex = node.rowIndex;
            return rowIndex == 0 ? 5 : false;
        },
        cellClassRules: {
            "cell-span-red": "true",
            "center-button": "true"
        },
        cellRenderer: () => '<button onclick="toggle(event)">Toggle Master/Detail</button>'
    },
    {
        headerName: "b",
        field: "b",
        colSpan: () => 3,
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
        headerName: "c",
        field: "c"
    },
    {
        headerName: "d",
        field: "d"
    },
    {
        headerName: "e",
        field: "e"
    },
    {
        headerName: "f",
        field: "f"
    },
    {
        headerName: "g",
        field: "g"
    },
    {
        headerName: "h",
        field: "h"
    }
];

var rowData = [{
        a: "1",
        b: "2",
        c: "3",
        d: "4",
        e: "5",
        f: "6",
        g: "7",
        h: "8"
    },
    {
        a: "1",
        b: "2",
        c: "3",
        d: "4",
        e: "5",
        f: "6",
        g: "7",
        h: "8"
    },
    {
        a: "1",
        b: "2",
        c: "3",
        d: "4",
        e: "5",
        f: "6",
        g: "7",
        h: "8"
    },
    {
        a: "1",
        b: "2",
        c: "3",
        d: "4",
        e: "5",
        f: "6",
        g: "7",
        h: "8"
    },
    {
        a: "1",
        b: "2",
        c: "3",
        d: "4",
        e: "5",
        f: "6",
        g: "7",
        h: "8"
    }
];

var gridOptions = {
    suppressRowTransform: true, // For row spanning to work
    columnDefs: columnDefs,
    rowData: rowData,
    onFirstDataRendered: () => {
        gridOptions.api.sizeColumnsToFit();
    }
};

function toggle(e) {
    console.log(123)
}

var eGridDiv = document.querySelector("#myGrid");

document.addEventListener("DOMContentLoaded", () => {
    new agGrid.Grid(eGridDiv, gridOptions);
});