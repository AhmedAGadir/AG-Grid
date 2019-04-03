var gridOptions = {
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete' },
        { headerName: 'Country', field: 'country' },
        { headerName: 'Sport', field: 'sport', enableRowGroup: true, rowGroup: true, hide: true },
        { headerName: 'Age', field: 'age' },
        { headerName: 'Year', field: 'year' },
        { headerName: 'Date', field: 'date' },
        { headerName: 'Gold', field: 'gold' },
        { headerName: 'Silver', field: 'silver' },
        { headerName: 'Bronze', field: 'bronze' },
        { headerName: 'Total', field: 'total' }
    ],
    defaultColDef: {
        width: 150,
    },
    autoGroupColumnDef: {
        cellRendererParams: {
            suppressCount: true
        }
    },
    rowData: null,
    onGridReady: params => params.api.sizeColumnsToFit(),
    onRowGroupOpened: () => {
        if (expandingProgrammatically) {
            return;
        }
        let counter = document.querySelector('[ref="group-opened-counter"]');
        counter.innerHTML = Number(counter.innerHTML) + 1;
    }
};

const debouncedToggleGroupNode = debounce(toggleGroupNode, 50); //debounce of 50ms

function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

let expandingProgrammatically = false;

function toggleGroupNode() {
    expandingProgrammatically = true;
    gridOptions.api.forEachNode(node => {
        if (node.group) {
            node.setExpanded(!node.expanded);
        }
    });
    setTimeout(() => expandingProgrammatically = false, 0);
}

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    agGrid
        .simpleHttpRequest({
            url:
                'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json',
        })
        .then(function (data) {
            gridOptions.api.setRowData(data.slice(0, 100).filter(row => row.sport === 'Swimming'));
        });
});
