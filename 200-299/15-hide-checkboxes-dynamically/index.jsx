"use strict";

import React, { Component } from "react";
import { render } from "react-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";

class GridExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        {
          headerName: "Organisation Hierarchy",
          field: 'orgHierarchy',
          colId: 'orgHierarchy',
          width: 300,
          valueGetter: params => params.data[params.column.colId][params.data[params.column.colId].length - 1],
          cellRenderer: 'agGroupCellRenderer',
          cellRendererParams: { suppressCount: true, checkbox: true }
        },
        { field: "jobTitle" }, { field: "employmentType" }],
      rowData: [
        {
          orgHierarchy: ["Erica Rogers"],
          jobTitle: "CEO",
          employmentType: "Permanent"
        },
        {
          orgHierarchy: ["Erica Rogers", "Malcolm Barrett"],
          jobTitle: "Exec. Vice President",
          employmentType: "Permanent"
        },
        {
          orgHierarchy: ["Erica Rogers", "Malcolm Barrett", "Esther Baker"],
          jobTitle: "Director of Operations",
          employmentType: "Permanent"
        },
        {
          orgHierarchy: ["Erica Rogers", "Malcolm Barrett", "Esther Baker", "Brittany Hanson"],
          jobTitle: "Fleet Coordinator",
          employmentType: "Permanent"
        },
        {
          orgHierarchy: ["Erica Rogers", "Malcolm Barrett", "Esther Baker", "Brittany Hanson", "Leah Flowers"],
          jobTitle: "Parts Technician",
          employmentType: "Contract"
        },
        {
          orgHierarchy: ["Erica Rogers", "Malcolm Barrett", "Esther Baker", "Brittany Hanson", "Tammy Sutton"],
          jobTitle: "Service Technician",
          employmentType: "Contract"
        },
        {
          orgHierarchy: ["Erica Rogers", "Malcolm Barrett", "Esther Baker", "Derek Paul"],
          jobTitle: "Inventory Control",
          employmentType: "Permanent"
        },
        {
          orgHierarchy: ["Erica Rogers", "Malcolm Barrett", "Francis Strickland"],
          jobTitle: "VP Sales",
          employmentType: "Permanent"
        },
        {
          orgHierarchy: ["Erica Rogers", "Malcolm Barrett", "Francis Strickland", "Morris Hanson"],
          jobTitle: "Sales Manager",
          employmentType: "Permanent"
        },
        {
          orgHierarchy: ["Erica Rogers", "Malcolm Barrett", "Francis Strickland", "Todd Tyler"],
          jobTitle: "Sales Executive",
          employmentType: "Contract"
        },
        {
          orgHierarchy: ["Erica Rogers", "Malcolm Barrett", "Francis Strickland", "Bennie Wise"],
          jobTitle: "Sales Executive",
          employmentType: "Contract"
        },
        {
          orgHierarchy: ["Erica Rogers", "Malcolm Barrett", "Francis Strickland", "Joel Cooper"],
          jobTitle: "Sales Executive",
          employmentType: "Permanent"
        }
      ],
      groupDefaultExpanded: -1,
      getDataPath: function (data) {
        return data.orgHierarchy;
      },
      defaultColDef: {
        resizable: true
      }
    };
  }

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

  };
  

  onToggleCheckboxes() {
    this.setState(prevState => ({
      columnDefs: [
        {
          headerName: "Organisation Hierarchy",
          field: 'orgHierarchy',
          colId: 'orgHierarchy',
          width: 300,
          valueGetter: params => params.data[params.column.colId][params.data[params.column.colId].length - 1],
          cellRenderer: 'agGroupCellRenderer',
          cellRendererParams: { suppressCount: true, checkbox: !prevState.columnDefs[0].cellRendererParams.checkbox }
        },
        { field: "jobTitle" }, { field: "employmentType" }]
    }));
  }
  render() {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <div style={{ height: "100%", paddingTop: "30px", boxSizing: "border-box" }}>
          <div
            id="myGrid"
            style={{
              height: "100%",
              width: "100%"
            }}
            className="ag-theme-balham"
          >
            <AgGridReact
              columnDefs={this.state.columnDefs}
              deltaColumnMode={true}
              rowData={this.state.rowData}
              treeData={true}
              animateRows={true}
              groupDefaultExpanded={this.state.groupDefaultExpanded}
              getDataPath={this.state.getDataPath}
              groupSuppressAutoColumn={true}
              onGridReady={this.onGridReady}
              defaultColDef={this.state.defaultColDef}
            />
          </div>
        </div>

        <div style={{ position: "absolute", top: "0px", left: "0px" }}>
          <input
            type="button"
            id="hide-checkboxes-button"
            value="Toggle checkboxes"
            onClick={this.onToggleCheckboxes.bind(this)}
          />
        </div>
      </div>
    );
  }
}

render(<GridExample />, document.querySelector("#root"));
