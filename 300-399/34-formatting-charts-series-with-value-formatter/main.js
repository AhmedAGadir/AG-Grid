var columnDefs = [
  // different ways to define 'categories'
  { field: 'athlete', width: 150, chartDataType: 'category' },
  { field: 'age', chartDataType: 'category', sort: 'asc' },
  { field: 'sport' }, // inferred as category by grid

  // excludes year from charts
  { field: 'year', chartDataType: 'excluded' },

  // different ways to define 'series'
  { 
    field: 'gold', 
    valueFormatter: myValueFormatter, 
    chartDataType: 'series' 
  },
  {
    field: 'silver',
    valueFormatter: myValueFormatter,
    chartDataType: 'series',
  },
  { 
    field: 'bronze', 
    valueFormatter: myValueFormatter 
  }, // inferred as series by grid
];

function myValueFormatter(params) {
  // return numberWithCommas(params.value);
  return params.value.toFixed(2);
}

// function numberWithCommas(x) {
//   x = x.toString();
//   var pattern = /(-?\d+)(\d{3})/;
//   while (pattern.test(x)) x = x.replace(pattern, '$1,$2');
//   return x;
// }

var gridOptions = {
  defaultColDef: {
    editable: true,
    sortable: true,
    flex: 1,
    minWidth: 140,
    filter: true,
    resizable: true,
  },
  popupParent: document.body,
  columnDefs: columnDefs,
  enableRangeSelection: true,
  enableCharts: true,
  processChartOptions: function(params) {
    var opts = params.options;

    opts.title.enabled = true;
    opts.title.text = 'Medals by Age';
    opts.legend.position = 'bottom';

    opts.seriesDefaults.tooltip.renderer = function(params) {
      var titleStyle = params.color
        ? ' style="color: white; background-color:' + params.color + '"'
        : '';
      var title = params.title
        ? '<div class="ag-chart-tooltip-title"' +
          titleStyle +
          '>' +
          params.title +
          '</div>'
        : '';
      var value = params.datum[params.yKey]
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

      return (
        title +
        '<div class="ag-chart-tooltip-content" style="text-align: center">' +
        value +
        '</div>'
      );
    };

    if (opts.xAxis) {
      opts.xAxis.label.rotation = 0;
    }

    if (opts.yAxis) {
      opts.yAxis.label.rotation = 0;
    }

    return opts;
  },
  onFirstDataRendered: onFirstDataRendered,
};

function onFirstDataRendered(params) {
  var createRangeChartParams = {
    cellRange: {
      rowStartIndex: 0,
      rowEndIndex: 20,
      columns: ['age', 'gold', 'silver', 'bronze'],
    },
    chartType: 'groupedColumn',
    chartContainer: document.querySelector('#myChart'),
    // aggFunc: 'sum',
    aggFunc: params => {
      return myValueFormatter({ value: params.reduce((a, b) => a + b) });
    },
  };

  params.api.createRangeChart(createRangeChartParams);
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);

  // do http request to get our sample data - not using any framework to keep the example self contained.
  // you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
  var httpRequest = new XMLHttpRequest();
  httpRequest.open(
    'GET',
    'https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/wideSpreadOfSports.json'
  );
  httpRequest.send();
  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === 4 && httpRequest.status === 200) {
      var httpResult = JSON.parse(httpRequest.responseText);
      var rowData = httpResult.map(row => ({
        ...row,
        gold: Math.random() * 100 + 10000,
        silver: Math.random() * 100 + 10000,
        bronze: Math.random() * 100 + 10000,
      }));
      gridOptions.api.setRowData(rowData);
    }
  };
});
