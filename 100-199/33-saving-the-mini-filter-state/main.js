function countries() {
    var listOfCountries = ['United States', 'Russia', 'Australia', 'Canada', 'Norway', 'China', 'Zimbabwe', 'Netherlands', 'South Korea', 'Croatia', 'France', 'Japan', 'Hungary', 'Germany', 'Poland', 'South Africa', 'Sweden', 'Ukraine', 'Italy', 'Czech Republic', 'Austria', 'Finland', 'Romania', 'Great Britain', 'Jamaica', 'Singapore', 'Belarus', 'Chile', 'Spain', 'Tunisia', 'Brazil', 'Slovakia', 'Costa Rica', 'Bulgaria', 'Switzerland', 'New Zealand', 'Estonia', 'Kenya', 'Ethiopia', 'Trinidad and Tobago', 'Turkey', 'Morocco', 'Bahamas', 'Slovenia', 'Armenia', 'Azerbaijan', 'India', 'Puerto Rico', 'Egypt', 'Kazakhstan', 'Iran', 'Georgia', 'Lithuania', 'Cuba', 'Colombia', 'Mongolia', 'Uzbekistan', 'North Korea', 'Tajikistan', 'Kyrgyzstan', 'Greece', 'Macedonia', 'Moldova', 'Chinese Taipei', 'Indonesia', 'Thailand', 'Vietnam', 'Latvia', 'Venezuela', 'Mexico', 'Nigeria', 'Qatar', 'Serbia', 'Serbia and Montenegro', 'Hong Kong', 'Denmark', 'Portugal', 'Argentina', 'Afghanistan', 'Gabon', 'Dominican Republic', 'Belgium', 'Kuwait', 'United Arab Emirates', 'Cyprus', 'Israel', 'Algeria', 'Montenegro', 'Iceland', 'Paraguay', 'Cameroon', 'Saudi Arabia', 'Ireland', 'Malaysia', 'Uruguay', 'Togo', 'Mauritius', 'Syria', 'Botswana', 'Guatemala', 'Bahrain', 'Grenada', 'Uganda', 'Sudan', 'Ecuador', 'Panama', 'Eritrea', 'Sri Lanka', 'Mozambique', 'Barbados'];
    return listOfCountries;
}

var columnDefs = [
    { field: 'athlete', filter: false },
    {
        headerName: 'Country',
        field: 'country',
        filter: 'agSetColumnFilter',
        filterParams: {
            newRowsAction: 'keep',
            suppressSorting: true,
            values: params => params.success(countries())
        },
        menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab']
    },
];

var gridOptions = {
    defaultColDef: {
        width: 100,
        sortable: true,
        resizable: true,

    },
    columnDefs: columnDefs,
    rowModelType: 'serverSide',
    animateRows: true,
    enableRangeSelection: true,
    postProcessPopup: postProcessPopup,
    onFirstDataRendered(params) {
        params.api.sizeColumnsToFit();
    }
};

let listenerAdded = false;
function postProcessPopup(params) {
    if (params.type === 'columnMenu') {
        setTimeout(() => {
            let miniFilter = params.ePopup.querySelector('input[type="text"]');
            if (listenerAdded) {
                miniFilter.value = window.miniFilterText;
            } else {
                miniFilter.addEventListener('input', e => {
                    window.miniFilterText = e.target.value;
                });
                listenerAdded = true;
            }
        }, 0);
    }
}

function saveFilterModel() {
    window.savedModel = gridOptions.api.getFilterModel();
    window.savedMiniFilter = window.miniFilterText;
}

function clearFilters() {
    gridOptions.api.setFilterModel(null);
    gridOptions.api.onFilterChanged();
    window.miniFilterText = '';
}

function restoreFilterModel() {
    gridOptions.api.setFilterModel(window.savedModel);
    window.miniFilterText = window.savedMiniFilter;
    gridOptions.api.onFilterChanged();
}

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    agGrid.simpleHttpRequest({ url: 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json' })
        .then(function (data) {
            var fakeServer = createFakeServer(data);
            var datasource = createServerSideDatasource(fakeServer, gridOptions);
            gridOptions.api.setServerSideDatasource(datasource);
        }
        );
});



function createServerSideDatasource(fakeServer, gridOptions) {
    function ServerSideDatasource(fakeServer, gridOptions) {
        this.fakeServer = fakeServer;
        this.gridOptions = gridOptions;
    }

    ServerSideDatasource.prototype.getRows = function (params) {
        // console.log('ServerSideDatasource.getRows: params = ', params);
        var that = this;
        this.fakeServer.getData(params.request,
            function successCallback(resultForGrid, lastRow) {
                params.successCallback(resultForGrid, lastRow);
            });
    };

    return new ServerSideDatasource(fakeServer, gridOptions);
}

function createFakeServer(data) {

    function FakeServer(allData) {
        this.allData = allData;
    }

    FakeServer.prototype.getData = function (request, callback) {

        var filterModel = request.filterModel;
        var sortModel = request.sortModel;

        var rowData = this.allData;
        rowData = this.filterList(rowData, filterModel);
        rowData = this.sortList(rowData, sortModel);

        var lastRowFound = (rowData.length <= request.endRow);
        var lastRow = lastRowFound ? rowData.length : null;

        rowData = rowData.slice(request.startRow, request.endRow);

        setTimeout(function () {
            callback(rowData, lastRow);
        }, 1000);
    };

    FakeServer.prototype.sortList = function (data, sortModel) {
        var sortPresent = sortModel && sortModel.length > 0;
        if (!sortPresent) {
            return data;
        }
        var resultOfSort = data.slice();
        resultOfSort.sort(function (a, b) {
            for (var k = 0; k < sortModel.length; k++) {
                var sortColModel = sortModel[k];
                var valueA = a[sortColModel.colId];
                var valueB = b[sortColModel.colId];
                if (valueA == valueB) {
                    continue;
                }
                var sortDirection = sortColModel.sort === 'asc' ? 1 : -1;
                if (valueA > valueB) {
                    return sortDirection;
                } else {
                    return sortDirection * -1;
                }
            }
            return 0;
        });
        return resultOfSort;
    };

    FakeServer.prototype.filterList = function (data, filterModel) {
        var filterPresent = filterModel && Object.keys(filterModel).length > 0;
        if (!filterPresent) {
            return data;
        }

        var resultOfFilter = [];
        for (var i = 0; i < data.length; i++) {
            var item = data[i];

            if (filterModel.country) {
                if (filterModel.country.values.indexOf(item.country) < 0) {
                    continue;
                }
            }

            resultOfFilter.push(item);
        }

        return resultOfFilter;
    };

    // simple implementation of lodash filter
    FakeServer.prototype.filter = function (data, callback) {
        var result = [];
        data.forEach(function (item) {
            if (callback(item)) {
                result.push(item);
            }
        });
        return result;
    };

    return new FakeServer(data);
}