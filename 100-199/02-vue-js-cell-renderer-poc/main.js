import Vue from "vue";
import { AgGridVue } from "ag-grid-vue";

import AgeRenderer from "./ageRenderer.js";

const VueExample = {
  template: `
        <div style="height: 100%">
            <div style="height: 100%; box-sizing: border-box;">
                      <ag-grid-vue style="width: 100%; height: 100%;" class="ag-theme-balham" id="myGrid"
                           :gridOptions="gridOptions"
                           @grid-ready="onGridReady"
                           :columnDefs="columnDefs"
                          :rowData="rowData"
                          :context="context"
                          :rowHeight="rowHeight"></ag-grid-vue>
            </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue
  },
  data: function () {
    return {
      gridOptions: null,
      gridApi: null,
      columnApi: null,
      columnDefs: null,
      rowData: null,
      context: null,
      rowHeight: null
    };
  },
  beforeMount() {
    this.gridOptions = {};
    this.columnDefs = [
      {
        headerName: "Athlete",
        field: "athlete"
      },
      {
        headerName: "Age",
        field: "age",
        cellRendererFramework: AgeRenderer
      }
    ];
    this.rowData = null;
    this.context = { componentParent: this };
    this.rowHeight = 50;
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
  },
  methods: {
    onGridReady(params) {
      const httpRequest = new XMLHttpRequest();
      const updateData = data => {
        this.rowData = data;
      };

      httpRequest.open(
        "GET",
        "https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json"
      );
      httpRequest.send();
      httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
          updateData(JSON.parse(httpRequest.responseText));
        }
      };
      params.api.sizeColumnsToFit();
    }
  }
};

new Vue({
  el: "#app",
  components: {
    "my-component": VueExample
  }
});
