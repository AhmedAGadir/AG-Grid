export default [
  {
    headerName: "",
    width: 100,
    rowSpan: params => {
      return params.data.start ? 18 : 1;
    },
    cellStyle: { background: "white", border: "1px solid #D9DCDE" },
    field: "pyramid",
    pinned: true
  },
  {
    headerName: "",
    width: 500,
    sortable: false,
    suppressMenu: true,
    pinned: true,
    resizable: true,
    children: [
      {
        headerName: "Company Priority 1",
        sortable: false,
        suppressMenu: true,
        resizable: true,
        pinned: true,
        children: [
          {
            headerName: "Company Priority 2",
            sortable: false,
            suppressMenu: true,
            resizable: true,
            pinned: true,
            children: [
              {
                headerName: "License events & product launches",
                width: 250,
                sortable: false,
                suppressMenu: true,
                resizable: true,
                pinned: true,
                field: "priority"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    headerName: "Aug Week1",
    width: 100,
    sortable: false,
    suppressMenu: true,
    children: [
      {
        headerName: "BTS/BTC",
        children: [
          {
            headerName: "Ease",
            children: [
              {
                headerName: "",
                cellClass: "cell-wrap-text",
                autoHeight: true,
                columnName: "weeks1",
                cellRenderer: "weekCellRender"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    headerName: "Aug Week2",
    width: 100,
    sortable: false,
    suppressMenu: true,
    children: [
      {
        headerName: "BTS/BTC",
        children: [
          {
            headerName: "Ease",
            children: [
              {
                headerName: "",
                cellClass: "cell-wrap-text",
                autoHeight: true,
                columnName: "weeks2",
                cellRenderer: "weekCellRender"
              }
            ]
          }
        ]
      }
    ]
  }
];
