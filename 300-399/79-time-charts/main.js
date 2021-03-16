var rows = [];
let startDate = new Date(2017, 11, 15);
for (var index = 0; index < 12; index++) {
  rows.push({
    athlete: 'Athelete',
    date: new Date(startDate.getTime()),
    gold: index % 10,
  });
  let nextMonth = startDate.getMonth() + 1;
  startDate.setMonth(nextMonth);
  console.log('startDate', startDate)
}
var gridOptions = {
  rowData: rows,
  columnDefs: [
    { field: 'athlete', width: 150 },
    { field: 'date', width: 200, chartDataType: 'time' },
    { field: 'gold', chartDataType: 'series' },
  ],
  defaultColDef: {
    editable: true,
    sortable: true,
    minWidth: 100,
    filter: true,
    resizable: true,
  },
  popupParent: document.body,
  enableRangeSelection: true,
  enableCharts: true,
  chartThemeOverrides: {
    common: {
      title: {
        enabled: true,
        text: 'Medals by Age',
      },
      legend: {
        position: 'bottom',
      },
    },
    area: {
      axes: {
        time: {
          nice: false,
          label: {
            rotation: 90,
            // formatter: function (params) {
            //   if (params.value.getMonth() !== 0) {
            //     return '';
            //   }
            //   return params.value.getFullYear();
            // },
          },
        },
      },
    },
  },
  onFirstDataRendered: onFirstDataRendered,
};

function onFirstDataRendered(params) {
  var createRangeChartParams = {
    cellRange: {
      rowStartIndex: 0,
      rowEndIndex: 1000,
      columns: ['date', 'gold'],
    },
    chartType: 'area',
    chartContainer: document.querySelector('#myChart'),
    aggFunc: 'sum',
  };

  params.api.createRangeChart(createRangeChartParams);
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);
});
