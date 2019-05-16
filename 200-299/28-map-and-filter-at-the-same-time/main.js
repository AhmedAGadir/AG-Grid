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
                          :defaultColDef="defaultColDef"
                          :components="components"
                          :treeData="true"
                          :animateRows="true"
                          :groupDefaultExpanded="groupDefaultExpanded"
                          :getDataPath="getDataPath"
                          :deltaRowDataMode="true"
                          :getRowNodeId="getRowNodeId"
                          :autoGroupColumnDef="autoGroupColumnDef"></ag-grid-vue>
            </div>
            <div style="position: absolute; top: 0px; left: 0px;">
                <button v-on:click="addNewGroup()">Add New Group</button>
                <button v-on:click="moveSelectedNodeToTarget(9)">Move Selected to 'stuff'</button>
                <button v-on:click="removeSelected()">Remove Selected</button>
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
      defaultColDef: null,
      components: null,
      groupDefaultExpanded: null,
      getDataPath: null,
      getRowNodeId: null,
      autoGroupColumnDef: null
    };
  },
  beforeMount() {
    this.gridOptions = {};
    this.columnDefs = [
      {
        field: "dateModified",
        comparator: (d1, d2) => {
          return new Date(d1).getTime() < new Date(d2).getTime() ? -1 : 1;
        }
      },
      {
        field: "size",
        aggFunc: "sum",
        valueFormatter: function(params) {
          return params.value ? Math.round(params.value * 10) / 10 + " MB" : "0 MB";
        }
      }
    ];
    this.rowData = [
      {
        id: 1,
        filePath: ["Documents"]
      },
      {
        id: 2,
        filePath: ["Documents", "txt"]
      },
      {
        id: 3,
        filePath: ["Documents", "txt", "notes.txt"],
        dateModified: "May 21 2017 01:50:00 PM",
        size: 14.7
      },
      {
        id: 4,
        filePath: ["Documents", "pdf"]
      },
      {
        id: 5,
        filePath: ["Documents", "pdf", "book.pdf"],
        dateModified: "May 20 2017 01:50:00 PM",
        size: 2.1
      },
      {
        id: 6,
        filePath: ["Documents", "pdf", "cv.pdf"],
        dateModified: "May 20 2016 11:50:00 PM",
        size: 2.4
      },
      {
        id: 7,
        filePath: ["Documents", "xls"]
      },
      {
        id: 8,
        filePath: ["Documents", "xls", "accounts.xls"],
        dateModified: "Aug 12 2016 10:50:00 AM",
        size: 4.3
      },
      {
        id: 9,
        filePath: ["Documents", "stuff"]
      },
      {
        id: 10,
        filePath: ["Documents", "stuff", "xyz.txt"],
        dateModified: "Jan 17 2016 08:03:00 PM",
        size: 1.1
      },
      {
        id: 11,
        filePath: ["Music", "mp3", "pop"],
        dateModified: "Sep 11 2016 08:03:00 PM",
        size: 14.3
      },
      {
        id: 12,
        filePath: ["temp.txt"],
        dateModified: "Aug 12 2016 10:50:00 PM",
        size: 101
      },
      {
        id: 13,
        filePath: ["Music", "mp3", "pop", "theme.mp3"],
        dateModified: "Aug 12 2016 10:50:00 PM",
        size: 101
      },
      {
        id: 14,
        filePath: ["Music", "mp3", "jazz"],
        dateModified: "Aug 12 2016 10:50:00 PM",
        size: 101
      }
    ];    
    
    var newGroupData = [];
    for (let i=0;i<20000;i++){
      newGroupData.push({
        id: getNextId(),
        filePath: ["Music", "wav", "hit_" +i + ".wav"],
        dateModified: "Aug 23 2017",
        size: 58.9
      });
    }

    this.rowData = this.rowData.concat(newGroupData);

    this.defaultColDef = {
      sortable: true,
      resizable: true,
      filter: true
    };
    this.groupDefaultExpanded = -1;
    this.getDataPath = data => {
      return data.filePath;
    };
    this.getRowNodeId = data => {
      return data.id;
    };
    this.autoGroupColumnDef = {
      headerName: "Files",
      width: 250,
      cellRendererParams: {
        checkbox: true,
        suppressCount: true,
      }
    };
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
  },
  methods: {
    addNewGroup() {
        var newGroupData = [{
          id: getNextId(),
          filePath: ["Music", "wav", "hit_" + new Date().getTime() + ".wav"],
          dateModified: "Aug 23 2017 11:52:00 PM",
          size: 58.9
        }];
      
      this.rowData.push(newGroupData);
    },
    removeSelected() {
      var selectedNode = this.gridApi.getSelectedNodes()[0];
      if (!selectedNode) {
        console.warn("No nodes selected!");
        return;
      }
      console.time('removeRows');
      let idsToRemove = getIdsToRemove(selectedNode);
      let updatedRowData = this.rowData.reduce((filtered, row) => {
        if (!idsToRemove.includes(row.id)) {
          filtered.push({...row, filePath: [...row.filePath]});
        }
        return filtered
      }, []);
      this.rowData = updatedRowData;
      console.timeEnd('removeRows');
    },
    onGridReady(params) {}
  }
};

function getNextId() {
  if (!window.nextId) {
    window.nextId = 15;
  } else {
    window.nextId++;
  }
  return window.nextId;
}

function getIdsToRemove(node) {
  var res = [];
  for (var i = 0; i < node.childrenAfterGroup.length; i++) {
    res = res.concat(getIdsToRemove(node.childrenAfterGroup[i]));
  }
  return node.data ? res.concat([node.data.id]) : res;
}

function getRowsToUpdate(node, parentPath) {
  var res = [];
  var newPath = parentPath.concat([node.key]);
  if (node.data) {
    node.data.filePath = newPath;
  }
  for (var i = 0; i < node.childrenAfterGroup.length; i++) {
    var updatedChildRowData = getRowsToUpdate(node.childrenAfterGroup[i], newPath);
    res = res.concat(updatedChildRowData);
  }
  return node.data ? res.concat([node.data]) : res;
}

new Vue({
  el: "#app",
  components: {
    "my-component": VueExample
  }
});
