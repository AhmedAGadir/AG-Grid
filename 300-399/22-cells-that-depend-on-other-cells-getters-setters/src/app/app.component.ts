import { Component, ViewChild } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  GridOptions,
  ColDef,
  ValueGetterParams,
  CellClassParams,
  CellValueChangedEvent
} from "ag-grid-community";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  total = 0;

  columnDefs: ColDef[] = [
    { headerName: "Make", field: "make" },
    { headerName: "Model", field: "model" },
    {
      headerName: "Price",
      field: "price",
      valueSetter: params => {
        params.data.price = Number(params.newValue);
        let difference = params.newValue - params.oldValue;
        this.total += difference;
        return true;
      }
    },
    {
      headerName: "Price%",
      field: "pricePct",
      valueGetter: params => {
        params.data.pricePct = ((100 * params.data.price) / this.total).toFixed(
          1
        );
        return params.data.pricePct;
      }
    }
  ];

  @ViewChild("grid", { static: true })
  grid: AgGridAngular;

  rowData = [
    { make: "Toyota", model: "Celica", price: 35000, pricePct: 0 },
    { make: "Ford", model: "Mondeo", price: 32000, pricePct: 0 },
    { make: "Porsche", model: "Boxter", price: 72000, pricePct: 0 }
  ];

  gridOptions: GridOptions = {
    defaultColDef: {
      editable: x => !x.data.isFooter,
      resizable: true
    },
    columnDefs: this.columnDefs,
    rowData: this.rowData
  };

  ngAfterViewInit() {
    this.total = this.rowData.reduce((cur, x) => cur + Number(x.price), 0);
    this.grid.columnApi.autoSizeAllColumns(false);
  }
}
