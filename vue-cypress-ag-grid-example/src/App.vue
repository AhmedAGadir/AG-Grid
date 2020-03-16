<template>
  <ag-grid-vue
    style="width: 500px; height: 500px;"
    class="ag-theme-balham"
    :columnDefs="columnDefs"
    :rowData="rowData"
  ></ag-grid-vue>
</template>
<script>
import { AgGridVue } from "ag-grid-vue";
import "ag-grid-enterprise";

// basic tests, filtering, sorting, checking content of grid data/rows etc.

export default {
  name: "App",
  data() {
    return {
      columnDefs: null,
      rowData: null
    };
  },
  components: {
    AgGridVue
  },
  beforeMount() {
    this.columnDefs = [
      { headerName: "Make", field: "make", sortable: true, filter: true },
      { headerName: "Model", field: "model", sortable: true, filter: true },
      { headerName: "Price", field: "price", sortable: true, filter: true }
    ];

    fetch("https://api.myjson.com/bins/15psn9")
      .then(result => result.json())
      .then(rowData => (this.rowData = rowData));
  }
};
</script>

<style lang="scss">
@import "../node_modules/ag-grid-community/dist/styles/ag-grid.css";
@import "../node_modules/ag-grid-community/dist/styles/ag-theme-balham.css";
</style>
