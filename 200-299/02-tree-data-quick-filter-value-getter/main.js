import Vue from "vue";
import { AgGridVue } from "ag-grid-vue";

import "ag-grid-enterprise";

const VueExample = {
  template: `
        <div style="height: 100%">
            <div style="height: 100%; padding-top: 30px; box-sizing: border-box;">
                      <ag-grid-vue style="width: 100%; height: 100%;" class="ag-theme-balham" id="myGrid"
                           :gridOptions="gridOptions"
                           @grid-ready="onGridReady"
                           :columnDefs="columnDefs"
                          :rowData="rowData"
                          :treeData="true"
                          :animateRows="true"
                          :groupDefaultExpanded="groupDefaultExpanded"
                          :getDataPath="getDataPath"
                          :autoGroupColumnDef="autoGroupColumnDef"></ag-grid-vue>
            </div>
            <div style="position: absolute; top: 0px; left: 0px;">
                <input type="text" id="filter-text-box" placeholder="Filter..." v-on:input="onFilterTextBoxChanged()">
            </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue
  },
  data: function() {
    return {
      gridOptions: null,
      gridApi: null,
      columnApi: null,
      columnDefs: null,
      rowData: null,
      groupDefaultExpanded: null,
      getDataPath: null,
      autoGroupColumnDef: null
    };
  },
  beforeMount() {
    this.gridOptions = {};
    this.columnDefs = [{ field: "jobTitle" }, { field: "employmentType" }];
    this.rowData = [
      {
        orgHierarchy: ["1"],
        name: 'Erica Rogers',
        jobTitle: "CEO",
        employmentType: "Permanent"
      },
      {
        orgHierarchy: ["1", "2"],
        name: 'Malcolm Barrett',
        jobTitle: "Exec. Vice President",
        employmentType: "Permanent"
      },
      {
        orgHierarchy: ["1", "2", "3"],
        name: 'Esther Baker',
        jobTitle: "Director of Operations",
        employmentType: "Permanent"
      },
      {
        orgHierarchy: ["1", "2", "3", "4"],
        name: 'Brittany Hanson',
        jobTitle: "Fleet Coordinator",
        employmentType: "Permanent"
      },
      {
        orgHierarchy: ["1", "2", "3", "4", "5"],
        name: 'Leah Flowers',
        jobTitle: "Parts Technician",
        employmentType: "Contract"
      },
      {
        orgHierarchy: ["1", "2", "3", "4", "6"],
        name: 'Tammy Sutton',
        jobTitle: "Service Technician",
        employmentType: "Contract"
      },
      {
        orgHierarchy: ["1", "2", "3", "7"],
        name: 'Derek Paul',
        jobTitle: "Inventory Control",
        employmentType: "Permanent"
      },
      {
        orgHierarchy: ["1", "2", "8"],
        name: 'Francis Strickland',
        jobTitle: "VP Sales",
        employmentType: "Permanent"
      },
      {
        orgHierarchy: ["1", "2", "8", "9"],
        name: 'Morris Hanson',
        jobTitle: "Sales Manager",
        employmentType: "Permanent"
      },
      {
        orgHierarchy: ["1", "2", "8", "10"],
        name: 'Todd Tyler',
        jobTitle: "Sales Executive",
        employmentType: "Contract"
      },
      {
        orgHierarchy: ["1", "2", "8", "11"],
        name: 'Bennie Wise',
        jobTitle: "Sales Executive",
        employmentType: "Contract"
      },
      {
        orgHierarchy: ["1", "2", "8", "12"],
        name: 'Joel Cooper',
        jobTitle: "Sales Executive",
        employmentType: "Permanent"
      }
    ];
    this.groupDefaultExpanded = -1;
    this.getDataPath = data => {
      return data.orgHierarchy;
    };
    this.autoGroupColumnDef = {
      headerName: "Organisation Hierarchy",
      valueGetter: (params) => {
        return params.node.data.name;
      },
      cellRendererParams: { 
        suppressCount: true,
        // innerRenderer: (params) => {
        //   return params.node.data.name;
        // }
      }
    };
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
  },
  methods: {
    onFilterTextBoxChanged() {
      this.gridApi.setQuickFilter(document.getElementById("filter-text-box").value);
    },
    onGridReady(params) {
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
