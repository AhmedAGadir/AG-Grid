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
    params.api.getRowNode(2).setSelected(true);
    params.api.getRowNode(3).setSelected(true);
    params.api.getRowNode(4).setSelected(true);
  }
};

function getContextMenuItems(params) {
  var result = [
    {
      name: "Copy",
      icon:
        '<span class="ag-icon ag-icon-copy" unselectable="on" role="presentation"></span>',
      action: function() {
        copyTextToClipboard(params.value);
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
