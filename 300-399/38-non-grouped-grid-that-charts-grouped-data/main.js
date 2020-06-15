let rowData;

let gridOptions = {
  rowData: rowData,
  columnDefs: [
    {
      headerName: 'Country',
      field: 'country',
      chartDataType: 'category',
    },
    {
      headerName: 'Count',
      field: 'total',
      chartDataType: 'series',
      aggFunc: 'sum',
    },
  ],
  defaultColDef: {
    flex: 1,
  },
  enableRangeSelection: true,
  enableCharts: true,
  createChartContainer: createChartContainer,
  popupParent: document.body,
  onFirstDataRendered: params => {
      let createRangeChartParams = {
        cellRange: {
          rowStartIndex: 0,
          rowEndIndex: 20,
          columns: ['country', 'total'],
        },
        chartType: 'groupedColumn',
      };
      params.api.createRangeChart(createRangeChartParams);
    },
};

let chartPanelTemplate =
  '<div class="chart-wrapper ag-theme-alpine">' +
  '<div class="chart-wrapper-top">' +
  '<span class="chart-wrapper-title"></span>' +
  '</div>' +
  '<div class="chart-wrapper-body"></div>' +
  '</div>';

function createChartContainer(chartRef) {
  let eTemp = document.createElement('div');
  eTemp.innerHTML = chartPanelTemplate;
  let eChartWrapper = eTemp.firstChild;

  let eParent = document.querySelector('#myGrid').parentElement;
  eParent.appendChild(eChartWrapper);

  let eChartBody = eChartWrapper.querySelector('.chart-wrapper-body');

  let { startRow, endRow } = gridOptions.api.getCellRanges()[0];

  let secondGridData = rowData.slice(startRow.rowIndex, endRow.rowIndex + 1);

  createSecondGridAndChart(secondGridData, eChartBody);

  eChartWrapper.querySelector('.chart-wrapper-title').innerText =
    'Chart Created At ' + new Date();
}

function createSecondGridAndChart(data, eChartBody) {
  let tempDiv = document.createElement('div');

  let tempGridOptions = {
    rowData: data,
    columnDefs: [
      {
        headerName: 'Country',
        field: 'country',
        chartDataType: 'category',
        rowGroup: true,
      },
      {
        headerName: 'Count',
        field: 'total',
        chartDataType: 'series',
        aggFunc: 'sum',
      },
    ],
    enableRangeSelection: true,
    enableCharts: true,
    popupParent: document.body,
    onFirstDataRendered: params => {
      let createRangeChartParams = {
        cellRange: {
          rowStartIndex: 0,
          rowEndIndex: data.length - 1,
          columns: ['ag-Grid-AutoColumn', 'total'],
        },
        chartType: 'groupedColumn',
        chartContainer: eChartBody,
      };
      params.api.createRangeChart(createRangeChartParams);
    },
  };
  new agGrid.Grid(tempDiv, tempGridOptions);
}

document.addEventListener('DOMContentLoaded', function() {
  let gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);

  let httpRequest = new XMLHttpRequest();
  httpRequest.open(
    'GET',
    'https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/olympicWinnersSmall.json'
  );
  httpRequest.send();
  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === 4 && httpRequest.status === 200) {
      rowData = JSON.parse(httpRequest.responseText).slice(50, 150);
      gridOptions.api.setRowData(rowData);
    }
  };
});
