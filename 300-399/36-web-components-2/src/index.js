const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://unpkg.com/ag-grid-community/dist/styles/ag-grid.css">
<link rel="stylesheet" href="https://unpkg.com/ag-grid-community/dist/styles/ag-theme-alpine.css">

<div id="myGrid" style="height: 600px;width:500px;" class="ag-theme-alpine"></div> 
`;

class AgGrid extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));


    this.columnDefs = [
      { headerName: "Make", field: "make", rowDrag: true },
      { headerName: "Model", rowGroup: true, field: "model" },
      { headerName: "Price", field: "price" }
    ];

    this.rowData = [
      { make: "Toyota", model: "Celica", price: 35000 },
      { make: "Ford", model: "Mondeo", price: 32000 },
      { make: "Porsche", model: "Boxter", price: 72000 },
      { make: "Toyota", model: "Celica", price: 35000 },
      { make: "Ford", model: "Mondeo", price: 32000 },
      { make: "Porsche", model: "Boxter", price: 72000 },
      { make: "Toyota", model: "Celica", price: 35000 },
      { make: "Ford", model: "Mondeo", price: 32000 },
      { make: "Porsche", model: "Boxter", price: 72000 },
      { make: "Toyota", model: "Celica", price: 35000 },
      { make: "Ford", model: "Mondeo", price: 32000 },
      { make: "Porsche", model: "Boxter", price: 72000 },
    ];

    this.gridOptions = {
      columnDefs: this.columnDefs,
      rowData: this.rowData,
      enableRangeSelection: true,
    };
  }

  connectedCallback() {
    var eGridDiv = this.shadowRoot.querySelector("#myGrid");
    new agGrid.Grid(eGridDiv, this.gridOptions);
  }
}

window.customElements.define('my-grid', AgGrid);

