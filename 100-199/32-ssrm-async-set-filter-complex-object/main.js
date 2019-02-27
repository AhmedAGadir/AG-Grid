function countryCodes() {
    var listOfCountries = ['United States', 'Russia', 'Australia', 'Canada', 'Norway', 'China', 'Zimbabwe', 'Netherlands', 'South Korea', 'Croatia', 'France', 'Japan', 'Hungary', 'Germany', 'Poland', 'South Africa', 'Sweden', 'Ukraine', 'Italy', 'Czech Republic', 'Austria', 'Finland', 'Romania', 'Great Britain', 'Jamaica', 'Singapore', 'Belarus', 'Chile', 'Spain', 'Tunisia', 'Brazil', 'Slovakia', 'Costa Rica', 'Bulgaria', 'Switzerland', 'New Zealand', 'Estonia', 'Kenya', 'Ethiopia', 'Trinidad and Tobago', 'Turkey', 'Morocco', 'Bahamas', 'Slovenia', 'Armenia', 'Azerbaijan', 'India', 'Puerto Rico', 'Egypt', 'Kazakhstan', 'Iran', 'Georgia', 'Lithuania', 'Cuba', 'Colombia', 'Mongolia', 'Uzbekistan', 'North Korea', 'Tajikistan', 'Kyrgyzstan', 'Greece', 'Macedonia', 'Moldova', 'Chinese Taipei', 'Indonesia', 'Thailand', 'Vietnam', 'Latvia', 'Venezuela', 'Mexico', 'Nigeria', 'Qatar', 'Serbia', 'Serbia and Montenegro', 'Hong Kong', 'Denmark', 'Portugal', 'Argentina', 'Afghanistan', 'Gabon', 'Dominican Republic', 'Belgium', 'Kuwait', 'United Arab Emirates', 'Cyprus', 'Israel', 'Algeria', 'Montenegro', 'Iceland', 'Paraguay', 'Cameroon', 'Saudi Arabia', 'Ireland', 'Malaysia', 'Uruguay', 'Togo', 'Mauritius', 'Syria', 'Botswana', 'Guatemala', 'Bahrain', 'Grenada', 'Uganda', 'Sudan', 'Ecuador', 'Panama', 'Eritrea', 'Sri Lanka', 'Mozambique', 'Barbados'];
    var listOfCountryCodes = ["UN", "RU", "AU", "CA", "NO", "CH", "ZI", "NE", "SO", "CR", "FR", "JA", "HU", "GE", "PO", "SW", "UK", "IT", "CZ", "FI", "RO", "GR", "SI", "BE", "SP", "TU", "BR", "SL", "CO", "BU", "ES", "KE", "ET", "TR", "MO", "BA", "AR", "AZ", "IN", "PU", "EG", "KA", "IR", "LI", "CU", "UZ", "TA", "KY", "MA", "TH", "VI", "LA", "VE", "ME", "NI", "QA", "SE", "HO", "DE", "AF", "GA", "DO", "KU", "CY", "IS", "AL", "IC", "PA", "SA", "UR", "TO", "SY", "BO", "GU", "UG", "SU", "EC", "ER", "SR"]
    return listOfCountryCodes;
}

var columnDefs = [
    { field: 'athlete' },
    {
        headerName: 'Country',
        field: 'country',
        cellRenderer: 'countryCellRenderer',
        filter: 'agSetColumnFilter',
        keyCreator: params => params.value.code,
        filterParams: {
            newRowsAction: 'keep',
            suppressSorting: true,
            values: params => {
                setTimeout(() => {
                    params.success(countryCodes());
                }, 2000);
            },
            // cell renderer is not neccessary
            // cellRenderer: params => {
            //     // because we're using keyCreator only the country code is passed here (not the whole complex object)
            //     return params.value;
            // }
        },
    },
];

var gridOptions = {
    defaultColDef: {
        width: 100,
        sortable: true,
        resizable: true,
        filter: true,
        menuTabs: ['filterMenuTab']
    },
    columnDefs: columnDefs,
    components: {
        countryCellRenderer: countryCellRenderer,
    },
    rowModelType: 'serverSide',
    animateRows: true,
    // debug: true,
    enableRangeSelection: true,
    // restrict to 2 server side calls concurrently
    maxConcurrentDatasourceRequests: 2,
    cacheBlockSize: 100,
    maxBlocksInCache: 2,
    onFirstDataRendered(params) {
        params.api.sizeColumnsToFit();
    },
    // onFilterChanged: params => {
    //     console.log(params);
    //     debugger
    // },
    onFilterModified: params => {
        debugger
    }
};

function countryCellRenderer(params) {
    if (!params.value) {
        return
    }
    return params.value.name + ' (' + params.value.code + ')';
}

function patchData(data) {
    // hack the data, replace each country with an object of country name and code
    data.forEach(function (row) {
        var countryName = row.country;
        var countryCode = countryName.substring(0, 2).toUpperCase();
        row.country = {
            name: countryName,
            code: countryCode,
        };
    });
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    // do http request to get our sample data - not using any framework to keep the example self contained.
    // you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
    agGrid.simpleHttpRequest({ url: 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json' })
        .then(function (data) {
            patchData(data);
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
        // var sortModel = request.sortModel;

        var rowData = this.allData;

        rowData = this.filterList(rowData, filterModel);

        // we mimic finding the last row. if the request exceeds the length of the
        // list, then we assume the last row is found. this would be similar to hitting
        // a database, where we have gone past the last row.
        var lastRowFound = (rowData.length <= request.endRow);
        var lastRow = lastRowFound ? rowData.length : null;

        // only return back the rows that the user asked for
        rowData = rowData.slice(request.startRow, request.endRow);

        // so that the example behaves like a server side call, we put
        // it in a timeout to a) give a delay and b) make it asynchronous
        setTimeout(function () {
            callback(rowData, lastRow);
        }, 1000);
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
                if (filterModel.country.values.indexOf(item.country.code) < 0) {
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