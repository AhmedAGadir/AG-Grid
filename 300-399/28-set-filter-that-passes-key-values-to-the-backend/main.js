var listOfCountries = ['United States', 'Russia', 'Australia', 'Canada', 'Norway', 'China', 'Zimbabwe', 'Netherlands', 'South Korea', 'Croatia', 'France', 'Japan', 'Hungary', 'Germany', 'Poland', 'South Africa', 'Sweden', 'Ukraine', 'Italy', 'Czech Republic', 'Austria', 'Finland', 'Romania', 'Great Britain', 'Jamaica', 'Singapore', 'Belarus', 'Chile', 'Spain', 'Tunisia', 'Brazil', 'Slovakia', 'Costa Rica', 'Bulgaria', 'Switzerland', 'New Zealand', 'Estonia', 'Kenya', 'Ethiopia', 'Trinidad and Tobago', 'Turkey', 'Morocco', 'Bahamas', 'Slovenia', 'Armenia', 'Azerbaijan', 'India', 'Puerto Rico', 'Egypt', 'Kazakhstan', 'Iran', 'Georgia', 'Lithuania', 'Cuba', 'Colombia', 'Mongolia', 'Uzbekistan', 'North Korea', 'Tajikistan', 'Kyrgyzstan', 'Greece', 'Macedonia', 'Moldova', 'Chinese Taipei', 'Indonesia', 'Thailand', 'Vietnam', 'Latvia', 'Venezuela', 'Mexico', 'Nigeria', 'Qatar', 'Serbia', 'Serbia and Montenegro', 'Hong Kong', 'Denmark', 'Portugal', 'Argentina', 'Afghanistan', 'Gabon', 'Dominican Republic', 'Belgium', 'Kuwait', 'United Arab Emirates', 'Cyprus', 'Israel', 'Algeria', 'Montenegro', 'Iceland', 'Paraguay', 'Cameroon', 'Saudi Arabia', 'Ireland', 'Malaysia', 'Uruguay', 'Togo', 'Mauritius', 'Syria', 'Botswana', 'Guatemala', 'Bahrain', 'Grenada', 'Uganda', 'Sudan', 'Ecuador', 'Panama', 'Eritrea', 'Sri Lanka', 'Mozambique', 'Barbados'];

    var listOfCountryCodes = ["UN", "RU", "AU", "CA", "NO", "CH", "ZI", "NE", "SO", "CR", "FR", "JA", "HU", "GE", "PO", "SW", "UK", "IT", "CZ", "FI", "RO", "GR", "SI", "BE", "SP", "TU", "BR", "SL", "CO", "BU", "ES", "KE", "ET", "TR", "MO", "BA", "AR", "AZ", "IN", "PU", "EG", "KA", "IR", "LI", "CU", "UZ", "TA", "KY", "MA", "TH", "VI", "LA", "VE", "ME", "NI", "QA", "SE", "HO", "DE", "AF", "GA", "DO", "KU", "CY", "IS", "AL", "IC", "PA", "SA", "UR", "TO", "SY", "BO", "GU", "UG", "SU", "EC", "ER", "SR"];

let countryMap = (function countryMap() {
    let map = {};
    listOfCountries.forEach((country, ind) => {
        let countryCode = listOfCountryCodes[ind];
        map[countryCode] = country
    });
    return map;
})();

var columnDefs = [
    { field: 'athlete' },
    {
        headerName: 'Country',
        field: 'country',        
        valueFormatter: function(params) {                
            if (!params || !params.value) {
                return;
            }
            let code = Object.keys(params.value)[0];
            let name = Object.values(params.value)[0]
            return `${name} (${code})`;
        },
        filter: 'agSetColumnFilter',
        filterParams: {
            newRowsAction: 'keep',
            suppressSorting: true,            
            values: params => {                                
                 setTimeout(() => {
                    params.success(listOfCountryCodes);  
                 }, 1000);
            },   
            cellRenderer: function(params) {   
                if (!params || !params.value) {
                    return;
                }       
                return countryMap[params.value];
            },
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
    rowModelType: 'serverSide',
    animateRows: true,     
    cacheBlockSize: 20,   
    onFirstDataRendered(params) {
        params.api.sizeColumnsToFit();
    }
};

function patchData(data) {
    // hack the data, replace each country with an object of country name and code
    data.forEach(function (row) {
        var countryName = row.country;
        var countryCode = countryName.substring(0, 2).toUpperCase();
        row.country = {
            [countryCode]: countryName            
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
        console.log(params.request);

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

        filteredData = this.filterList(rowData, filterModel);
        rowData = this.sortList(filteredData, sortModel);

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

    FakeServer.prototype.filterList = function(data, filterModel) {
        var filterPresent = filterModel && Object.keys(filterModel).length > 0;
        if (!filterPresent) return data;  
        return data.filter(d => {
            let countryCode = Object.keys(d.country)[0];
            return filterModel.country.values.indexOf(countryCode) > -1;
        });
    };


    return new FakeServer(data);
}