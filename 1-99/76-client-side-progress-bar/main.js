var progress = 100;
function showProgress(percent) {
    progress = percent;
    gridOptions.api.hideOverlay();
    gridOptions.api.showLoadingOverlay();

    if (percent === 100) {
        gridOptions.api.hideOverlay();
    }
}

function showProgressAnimation() {
    let x = 0;
    let interval = setInterval(() => {
        showProgress(x++);
        if (x > 100) {
            clearInterval(interval)
        }
    }, 20);
}

var gridOptions = {
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete' },
        { headerName: 'Sport', field: 'sport' },
        { headerName: 'Age', field: 'age' },
        { headerName: 'Year', field: 'year' },
        { headerName: 'Date', field: 'date' },
        { headerName: 'Gold', field: 'gold' },
        { headerName: 'Silver', field: 'silver' },
        { headerName: 'Bronze', field: 'bronze' },
    ],
    defaultColDef: {
        width: 150,
    },
    rowData: null,
    components: {
        customLoadingOverlay: CustomLoadingOverlay,
    },
    loadingOverlayComponent: 'customLoadingOverlay',
    loadingOverlayComponentParams: {
        progress: () => progress
    },
};

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    agGrid
        .simpleHttpRequest({
            url:
                'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json',
        })
        .then(function (data) {
            gridOptions.api.setRowData(data);
        });
});
