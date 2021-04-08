import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import {AgGridReact} from "@ag-grid-community/react";
import {actions} from './actions/index.jsx'

import {AllModules} from "@ag-grid-enterprise/all-modules";

import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";

class FileView extends Component {
  colDefs = [
    {field: "file"},
    {field: "folder", rowGroup: true, hide: true},
    {field: "dateModified"},
    {field: "size"}
  ];

  autoGroupColumnDef = {
    checkboxSelection: true,
    headerName: "Folder",
    sort: 'asc',
    cellRendererParams: {
      suppressCount: true
    }
  };

  modules = AllModules;

  onRowSelected = params => {
    if (params.node.selected) {
      this.props.actions.rowSelected(params.node.id);
    } else {
      this.props.actions.rowDeselected(params.node.id)
    }
  }

  onFirstDataRendered = params => {
    params.api.sizeColumnsToFit();

    this.props.selectedRows.forEach(id => {
      params.api.getRowNode(id).setSelected(true);
    })
  }

  render() {
    return (
      <div id='myGrid' style={{ flex: 1 }} className="ag-theme-alpine">
        <AgGridReact
          rowSelection='multiple'
          columnDefs={this.colDefs}
          rowData={this.props.files}
          immutableData={true}
          getRowNodeId={data => data.id}
          autoGroupColumnDef={this.autoGroupColumnDef}
          modules={this.modules}
          groupDefaultExpanded={-1}
          onFirstDataRendered={this.onFirstDataRendered}
          getContextMenuItems={this.getContextMenuItems}
          onRowSelected={this.onRowSelected}>
        </AgGridReact>
      </div>
    )
  }

  getContextMenuItems = (params) => {
    const folderActions = [{
      name: "New File",
      action: () => this.props.actions.newFile(params.node.key)
    }];

    const fileActions = [{
      name: "Delete File",
      action: () => this.props.actions.deleteFile(params.node.data.id)
    }];

    return params.node.group ? folderActions : fileActions;
  };
}

const mapStateToProps = (state) => ({
    files: state.fileReducer.files,
    selectedRows: state.rowSelectedReducer.selectedRows
  });

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(FileView);
