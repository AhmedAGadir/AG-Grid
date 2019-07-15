var columnDefs = [
    {
        headerName: 'Athlete',
        field: 'athlete',
        filter: 'agSetColumnFilter',
        filterParams: {
            apply: true
        },
        menuTabs: ['filterMenuTab'],
    },
];

var gridOptions = {
    columnDefs: columnDefs,
    postProcessPopup: params => {
        setTimeout(() => {
            let applyButton = params.ePopup.querySelector('button[ref="eApplyButton"]');
            applyButton.addEventListener('click', () => gridOptions.api.hidePopupMenu());
        }, 0);
    },
};



// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    agGrid
        .simpleHttpRequest({
            url:
                'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json',
        })
        .then(function (data) {
            gridOptions.api.setRowData(data.slice(0, 100));
        });
});
