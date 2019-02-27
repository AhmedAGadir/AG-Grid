function countryCodes() {
    var listOfCountries = ['United States', 'Russia', 'Australia', 'Canada', 'Norway', 'China', 'Zimbabwe', 'Netherlands', 'South Korea', 'Croatia', 'France', 'Japan', 'Hungary', 'Germany', 'Poland', 'South Africa', 'Sweden', 'Ukraine', 'Italy', 'Czech Republic', 'Austria', 'Finland', 'Romania', 'Great Britain', 'Jamaica', 'Singapore', 'Belarus', 'Chile', 'Spain', 'Tunisia', 'Brazil', 'Slovakia', 'Costa Rica', 'Bulgaria', 'Switzerland', 'New Zealand', 'Estonia', 'Kenya', 'Ethiopia', 'Trinidad and Tobago', 'Turkey', 'Morocco', 'Bahamas', 'Slovenia', 'Armenia', 'Azerbaijan', 'India', 'Puerto Rico', 'Egypt', 'Kazakhstan', 'Iran', 'Georgia', 'Lithuania', 'Cuba', 'Colombia', 'Mongolia', 'Uzbekistan', 'North Korea', 'Tajikistan', 'Kyrgyzstan', 'Greece', 'Macedonia', 'Moldova', 'Chinese Taipei', 'Indonesia', 'Thailand', 'Vietnam', 'Latvia', 'Venezuela', 'Mexico', 'Nigeria', 'Qatar', 'Serbia', 'Serbia and Montenegro', 'Hong Kong', 'Denmark', 'Portugal', 'Argentina', 'Afghanistan', 'Gabon', 'Dominican Republic', 'Belgium', 'Kuwait', 'United Arab Emirates', 'Cyprus', 'Israel', 'Algeria', 'Montenegro', 'Iceland', 'Paraguay', 'Cameroon', 'Saudi Arabia', 'Ireland', 'Malaysia', 'Uruguay', 'Togo', 'Mauritius', 'Syria', 'Botswana', 'Guatemala', 'Bahrain', 'Grenada', 'Uganda', 'Sudan', 'Ecuador', 'Panama', 'Eritrea', 'Sri Lanka', 'Mozambique', 'Barbados'];
    var listOfCountryCodes = ['UN', 'RU', 'AU', 'CA', 'NO', 'CH', 'ZI', 'NE', 'SO', 'CR', 'FR', 'JA', 'HU', 'GE', 'PO', 'SO', 'SW', 'UK', 'IT', 'CZ', 'AU', 'FI', 'RO', 'GR', 'JA', 'SI', 'BE', 'CH', 'SP', 'TU', 'BR', 'SL', 'CO', 'BU', 'SW', 'NE', 'ES', 'KE', 'ET', 'TR', 'TU', 'MO', 'BA', 'SL', 'AR', 'AZ', 'IN', 'PU', 'EG', 'KA', 'IR', 'GE', 'LI', 'CU', 'CO', 'MO', 'UZ', 'NO', 'TA', 'KY', 'GR', 'MA', 'MO', 'CH', 'IN', 'TH', 'VI', 'LA', 'VE', 'ME', 'NI', 'QA', 'SE', 'SE', 'HO', 'DE', 'PO', 'AR', 'AF', 'GA', 'DO', 'BE', 'KU', 'UN', 'CY', 'IS', 'AL', 'MO', 'IC', 'PA', 'CA', 'SA', 'IR', 'MA', 'UR', 'TO', 'MA', 'SY', 'BO', 'GU', 'BA', 'GR', 'UG', 'SU', 'EC', 'PA', 'ER', 'SR', 'MO', 'BA'];
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
            values: params => {
                setTimeout(() => {
                    params.success(countryCodes());
                }, 2000);
            },
            suppressSorting: true
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
        resizable: true,
        filter: true,
        menuTabs: ['filterMenuTab'],
    },
    components: {
        countryCellRenderer: countryCellRenderer,
    },
    columnDefs: columnDefs,
    rowData: null,
};

function countryCellRenderer(params) {
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

    agGrid
        .simpleHttpRequest({
            url:
                'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json',
        })
        .then(function (data) {
            patchData(data);
            gridOptions.api.setRowData(data);
        });
});
