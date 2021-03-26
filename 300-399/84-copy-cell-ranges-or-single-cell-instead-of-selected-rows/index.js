import "./style.css";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import * as ag from "ag-grid-community";

var gridOptions = {
  columnDefs: [
    { checkboxSelection: true, maxWidth: 50 },
    { field: "make" },
    { field: "model" },
    { field: "price" }
  ],
  rowData: [
    { make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Porsche", model: "Boxter", price: 72000 },
    { make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Porsche", model: "Boxter", price: 72000 },
    { make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Porsche", model: "Boxter", price: 72000 }
  ],
  rowSelection: "multiple",
  getContextMenuItems: getContextMenuItems,
  onGridReady: params => {
    params.api.getRowNode(0).setSelected(true);
    params.api.getRowNode(1).setSelected(true);
    params.api.getRowNode(2).setSelected(true);
  },
  enableRangeSelection: true
};

function getContextMenuItems(params) {
  var result = [
    {
      name: "Copy",
      icon:
        '<span class="ag-icon ag-icon-copy" unselectable="on" role="presentation"></span>',
      action: function() {
        let toCopy;
        // if cell range is selected - copy selected cell range instead of selected rows
        let cellRanges = params.api.getCellRanges();
        if (cellRanges.length > 0) {
          const { startRow, endRow, columns } = cellRanges[0];

          let startIndex =
            startRow.rowIndex < endRow.rowIndex
              ? startRow.rowIndex
              : endRow.rowIndex;

          let endIndex =
            startRow.rowIndex < endRow.rowIndex
              ? endRow.rowIndex
              : startRow.rowIndex;

          let rowsToCopy = [];

          for (let i = startIndex; i <= endIndex; i++) {
            let rowNode = params.api.getRowNode(i);
            let cellValuesToCopy = [];
            columns.forEach(col => {
              let cellValue = params.api.getValue(col.getColId(), rowNode);
              cellValuesToCopy.push(cellValue);
            });
            let cellValuesToCopyStr = cellValuesToCopy.join(" ");
            rowsToCopy.push(cellValuesToCopyStr);
          }
          toCopy = rowsToCopy.join("\n");
        } else {
          // if no cell range is selected, copy the cell at the position where the context menu was opened instead of the. selected rows
          toCopy = params.value;
        }

        copyTextToClipboard(toCopy);
      }
    },
    "copyWithHeaders", // built in separator
    "paste",
    "separator",
    "export"
  ];

  return result;
}

function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
    console.log("Fallback: Copying text command was " + msg);
    document.querySelector(
      "#copied"
    ).textContent = `"${text}" was copied to the clipboard`;
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }

  document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(
    function() {
      console.log("Async: Copying to clipboard was successful!");
    },
    function(err) {
      fallbackCopyTextToClipboard(text);
      // console.error("Async: Could not copy text: ", err);
    }
  );
}

new ag.Grid(document.querySelector("#myGrid"), gridOptions);
