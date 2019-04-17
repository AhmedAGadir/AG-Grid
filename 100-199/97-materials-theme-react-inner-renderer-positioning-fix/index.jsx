"use strict";

import React, { Component } from "react";
import { render } from "react-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import RowNumberCellRendererComponent from "./RowNumberCellRendererComponent.jsx";

class GridExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        {
          field: "dateModified",
          comparator: function(d1, d2) {
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
      ],
      rowData: [
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
      ],
      components: { 
        fileCellRenderer: getFileCellRenderer()
      },
      frameworkComponents: {
        rowNumberCellRenderer: RowNumberCellRendererComponent
      },
      groupDefaultExpanded: -1,
      getDataPath: function(data) {
        return data.filePath;
      },
      getRowNodeId: function(data) {
        return data.id;
      },
      autoGroupColumnDef: {
        headerName: "Files",
        width: 350,
        cellRendererParams: {
          checkbox: false,
          suppressCount: true,
          innerRenderer: "rowNumberCellRenderer"
        }
      }
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  addNewGroup() {
    var newGroupData = [
      {
        id: getNextId(),
        filePath: ["Music", "wav", "hit_" + new Date().getTime() + ".wav"],
        dateModified: "Aug 23 2017 11:52:00 PM",
        size: 58.9
      }
    ];
    this.gridApi.updateRowData({ add: newGroupData });
  }
  removeSelected() {
    var selectedNode = this.gridApi.getSelectedNodes()[0];
    if (!selectedNode) {
      console.warn("No nodes selected!");
      return;
    }
    this.gridApi.updateRowData({ remove: getRowsToRemove(selectedNode) });
  }
  moveSelectedNodeToTarget(targetRowId) {
    var selectedNode = this.gridApi.getSelectedNodes()[0];
    if (!selectedNode) {
      console.warn("No nodes selected!");
      return;
    }
    var targetNode = this.gridApi.getRowNode(targetRowId);
    var invalidMove = selectedNode.key === targetNode.key || isSelectionParentOfTarget(selectedNode, targetNode);
    if (invalidMove) {
      console.warn("Invalid selection - must not be parent or same as target!");
      return;
    }
    var rowsToUpdate = getRowsToUpdate(selectedNode, targetNode.data.filePath);
    this.gridApi.updateRowData({ update: rowsToUpdate });
  }
  render() {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <div style={{ height: "100%", paddingTop: "30px", boxSizing: "border-box" }}>
          <div
            id="myGrid"
            style={{
              boxSizing: "border-box",
              height: "100%",
              width: "100%"
            }}
            className="ag-theme-material"
          >
            <AgGridReact
              columnDefs={this.state.columnDefs}
              rowData={this.state.rowData}
              components={this.state.components}
              frameworkComponents={this.state.frameworkComponents}
              treeData={true}
              animateRows={true}
              enableFilter={true}
              enableSorting={true}
              enableColResize={true}
              groupDefaultExpanded={this.state.groupDefaultExpanded}
              getDataPath={this.state.getDataPath}
              getRowNodeId={this.state.getRowNodeId}
              autoGroupColumnDef={this.state.autoGroupColumnDef}
              onGridReady={this.onGridReady.bind(this)}
            />
          </div>
        </div>

        <div style={{ position: "absolute", top: "0px", left: "0px" }}>
          <button onClick={this.addNewGroup.bind(this)}>Add New Group</button>
          <button onClick={this.moveSelectedNodeToTarget.bind(this, 9)}>Move Selected to 'stuff'</button>
          <button onClick={this.removeSelected.bind(this)}>Remove Selected</button>
        </div>
      </div>
    );
  }
}

function getNextId() {
  if (!window.nextId) {
    window.nextId = 13;
  } else {
    window.nextId++;
  }
  return window.nextId;
}
function getFileCellRenderer() {
  function FileCellRenderer() {}
  FileCellRenderer.prototype.init = function(params) {
    var tempDiv = document.createElement("div");
    var value = params.value;
    var icon = getFileIcon(params.value);
    tempDiv.innerHTML = icon
      ? '<span><i class="' + icon + '"></i>' + '<span class="filename"></span>' + value + "</span>"
      : value;
    this.eGui = tempDiv.firstChild;
  };
  FileCellRenderer.prototype.getGui = function() {
    return this.eGui;
  };
  return FileCellRenderer;
}
function getRowsToRemove(node) {
  var res = [];
  for (var i = 0; i < node.childrenAfterGroup.length; i++) {
    res = res.concat(getRowsToRemove(node.childrenAfterGroup[i]));
  }
  return node.data ? res.concat([node.data]) : res;
}
function isSelectionParentOfTarget(selectedNode, targetNode) {
  var children = selectedNode.childrenAfterGroup;
  for (var i = 0; i < children.length; i++) {
    if (targetNode && children[i].key === targetNode.key) return true;
    isSelectionParentOfTarget(children[i], targetNode);
  }
  return false;
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
function getFileIcon(filename) {
  return filename.endsWith(".mp3") || filename.endsWith(".wav")
    ? "fa fa-file-audio-o"
    : filename.endsWith(".xls")
      ? "fa fa-file-excel-o"
      : filename.endsWith(".txt")
        ? "fa fa fa-file-o"
        : filename.endsWith(".pdf")
          ? "fa fa-file-pdf-o"
          : "fa fa-folder";
}

render(<GridExample />, document.querySelector("#root"));
