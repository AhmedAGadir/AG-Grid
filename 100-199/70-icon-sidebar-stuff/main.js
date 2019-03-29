var columnDefs = [
    { headerName: "Country", field: "country" },
    { headerName: "Athlete", field: "athlete" },
    { headerName: "Sport", field: "sport" },
    { headerName: "Age", field: "age", filter: 'agNumberColumnFilter' },
    { headerName: "Year", field: "year", filter: 'agNumberColumnFilter' },
    { headerName: "Gold", field: "gold", filter: 'agNumberColumnFilter' },
    { headerName: "Silver", field: "silver", filter: 'agNumberColumnFilter' },
    { headerName: "Bronze", field: "bronze", filter: 'agNumberColumnFilter' },
    { headerName: "Total", field: "total", filter: 'agNumberColumnFilter' }
];

var gridOptions = {
    defaultColDef: {
        filter: true
    },
    columnDefs: columnDefs,
    rowData: null,
    animateRows: true,
    onFilterChanged: onFilterChanged,
    sideBar: {
        toolPanels: [
            {
                id: 'columns',
                labelDefault: '',
                labelKey: 'columns',
                iconKey: 'columns',
                toolPanel: 'agColumnsToolPanel',
            },
            {
                id: 'filters',
                labelDefault: '',
                labelKey: 'customTP',
                iconKey: 'filter',
                toolPanel: 'agFiltersToolPanel',
            }
        ],
        defaultToolPanel: 'customTP'
    },
};

let refreshIconAdded = false;
function onFilterChanged(params) {
    const isFilterActive = Object.keys(params.api.getFilterModel()).length > 0;
    const sideButtons = document.querySelector('.ag-side-buttons');
    const iconWrap = document.querySelector('.ag-side-button:nth-of-type(2) > button > div');
    if (isFilterActive) {
        if (refreshIconAdded) {
            return;
        }
        sideButtons.classList.add('wide');
        let icon = document.createElement('icon');
        icon.addEventListener('click', resetFilter);
        icon.className = "fas fa-redo";
        iconWrap.appendChild(icon);
        refreshIconAdded = true;
    } else {
        sideButtons.classList.remove('wide');
        let icon = iconWrap.querySelector('icon');
        icon.removeEventListener('click', resetFilter);
        icon.remove();
        refreshIconAdded = false;
    }
}

function resetFilter(e) {
    e.stopPropagation();
    gridOptions.api.setFilterModel(null);
}

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json');
    httpRequest.send();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            var httpResult = JSON.parse(httpRequest.responseText);
            gridOptions.api.setRowData(httpResult);
        }
    };
});
