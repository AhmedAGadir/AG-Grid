var gridOptions = {
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete', filter: 'agTextColumnFilter' },
        { headerName: 'Country', field: 'country', filter: 'agTextColumnFilter' },
        { headerName: 'Sport', field: 'sport', filter: 'agTextColumnFilter' },
        // { headerName: 'Age', field: 'age', filter: 'agNumberColumnFilter' },
        // { headerName: 'Year', field: 'year', filter: 'agNumberColumnFilter' },
        // { headerName: 'Date', field: 'date', filter: 'agDateColumnFilter' },
        // { headerName: 'Gold', field: 'gold', filter: 'agNumberColumnFilter' },
        // { headerName: 'Silver', field: 'silver', filter: 'agNumberColumnFilter' },
        // { headerName: 'Bronze', field: 'bronze', filter: 'agNumberColumnFilter' },
        // { headerName: 'Total', field: 'total', filter: 'agNumberColumnFilter' }
    ],
    defaultColDef: {
        width: 200,
        floatingFilterComponent: 'myCustomFloatingFilter',
        floatingFilterComponentParams: {
            suppressFilterButton: true,
            debounceMs: 700
        }
    },
    floatingFilter: true,
    rowData: null,
    components: {
        myCustomFloatingFilter: MyCustomFloatingFilter
    },
    onFilterChanged: params => console.log(params.api.getFilterModel())

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

function MyCustomFloatingFilter() { }

MyCustomFloatingFilter.prototype.init = function (params) {
    this.params = params;

    this.eInput = document.createElement('input');
    this.eInput.style.width = '80%';
    this.eInput.style.marginRight = '5px';

    this.debouncedFloatingFilterChanged = debounce(this.onFloatingFilterChanged, params.debounceMs)

    this.eInput.addEventListener('input', event => {
        let floatingFilterChangedParams = null;
        if (event.target.value) {
            floatingFilterChangedParams = {
                model: {
                    type: 'contains',
                    filter: event.target.value,
                    filterType: 'text'
                }
            };
        }
        this.debouncedFloatingFilterChanged(floatingFilterChangedParams);
    })

    this.eButton = document.createElement('button');
    this.eButton.textContent = 'click';
    this.eButton.onclick = function (e) {
    }

    this.eGui = document.createElement('div');
    this.eGui.appendChild(this.eInput);
    this.eGui.appendChild(this.eButton);
}

MyCustomFloatingFilter.prototype.getGui = function () {
    return this.eGui;
}

MyCustomFloatingFilter.prototype.onParentModelChanged = function (parentModel) {
    this.eInput.value = parentModel ? parentModel.filter : ''
}

MyCustomFloatingFilter.prototype.onFloatingFilterChanged = function (newFilterModel) {
    this.params.onFloatingFilterChanged(newFilterModel);
}


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

