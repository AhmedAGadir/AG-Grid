import { Component, ViewChild } from "@angular/core";
import { MyCellRenderer } from './my-cell-renderer.component';

import "ag-grid-enterprise";

@Component({
  selector: "my-app",
  templateUrl: './app.component.html'
})
export class AppComponent {

  private gridApi;
  private gridColumnApi;

  private columnDefs;
  private rowData;
  private defaultColDef;
  private components;
  private groupDefaultExpanded;
  private getDataPath;
  private getRowNodeId;
  private autoGroupColumnDef;
  private frameworkComponents;

  private dropped: any[];

  constructor() {

    this.columnDefs = [
      {
        field: "dateModified",
        comparator: function (d1, d2) {
          return new Date(d1).getTime() < new Date(d2).getTime() ? -1 : 1;
        }
      },
      {
        field: "size",
        aggFunc: "sum",
        valueFormatter: function (params) {
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
    this.defaultColDef = {
      sortable: true,

      resizable: true,
      filter: true,
      cellRenderer: 'myCellRenderer',
    };
    this.components = { fileCellRenderer: getFileCellRenderer() };
    this.groupDefaultExpanded = -1;
    this.getDataPath = function (data) {
      return data.filePath;
    };
    this.getRowNodeId = function (data) {
      return data.id;
    };

    this.autoGroupColumnDef = {
      headerName: "Files",
      width: 250,
      cellRendererParams: {
        checkbox: true,
        suppressCount: true,
        innerRenderer: "fileCellRenderer"
      }
    };

    this.frameworkComponents = {
      myCellRenderer: MyCellRenderer
    }
  }

  onCellMouseOver(params) {

    // if (!this.dropped) {
    //   // no files dropped - abort
    //   return;
    // }

    // //get the path of the folder on which the files were dropped

    // let path = [];

    // if (params.data) {

    //   //files dropped on a data element
    //   path = params.data.filePath;

    // } else {

    //   //dropped on a 'filler' element (https://www.ag-grid.com/javascript-grid-tree-data/#filler-nodes)
    //   //construct the path components by looping over the parent nodes
    //   let node = params.node;
    //   while (node) {
    //     if (node.key) {
    //       path.unshift(node.key);
    //     }
    //     node = node.parent;
    //   }

    // }

    // console.log('You dropped', this.dropped || '-nothing-', 'on folder', path.join('/'));

    // this.dropped = null;
    
  }

  onFileDrop(e: any): void {
    /*
     * set variable on drop - used in mouseover event
     * we use this setup so we have access to the drop target (e.g. a folder or file in the grid)
     */

    // console.log('Files are being dropped...')

    // this.dropped = e;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
}

function getFileCellRenderer() {
  function FileCellRenderer() { }
  FileCellRenderer.prototype.init = function (params) {
    var tempDiv = document.createElement("div");
    var value = params.value;
    var icon = getFileIcon(params.value);
    tempDiv.innerHTML = icon
      ? '<span><i class="' + icon + '"></i>' + '<span class="filename"></span>' + value + "</span>"
      : value;
    this.eGui = tempDiv.firstChild;
  };
  FileCellRenderer.prototype.getGui = function () {
    return this.eGui;
  };
  return FileCellRenderer;
}

function isSelectionParentOfTarget(selectedNode, targetNode) {
  var children = selectedNode.childrenAfterGroup;
  for (var i = 0; i < children.length; i++) {
    if (targetNode && children[i].key === targetNode.key) return true;
    isSelectionParentOfTarget(children[i], targetNode);
  }
  return false;
}

function getFileIcon(filename) {
  return filename.endsWith(".mp3") || filename.endsWith(".wav")
    ? "far fa-file-audio"
    : filename.endsWith(".xls")
      ? "far fa-file-excel"
      : filename.endsWith(".txt")
        ? "far fa fa-file"
        : filename.endsWith(".pdf")
          ? "far fa-file-pdf"
          : "far fa-folder";
}
