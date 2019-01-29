"use strict";

import React, { Component } from "react";
import { render } from "react-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";

class GridExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [{ field: "jobTitle" }, { field: "employmentType" }],
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
      getDataPath: function(data) {
        return data.orgHierarchy;
      },
      autoGroupColumnDef: {
        headerName: "Organisation Hierarchy",
        cellRendererParams: { 
          suppressCount: true,
          innerRendererFramework: MyInnerRenderer 
        }
      }
    };
  }

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    params.api.sizeColumnsToFit();
  };
  
  render() {
    return (
      <div style={{ width: "100%", height: "100%" }}>
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
              rowData={this.state.rowData}
              treeData={true}
              animateRows={true}
              groupDefaultExpanded={this.state.groupDefaultExpanded}
              getDataPath={this.state.getDataPath}
              autoGroupColumnDef={this.state.autoGroupColumnDef}
              onGridReady={this.onGridReady}
            />
          </div>
      </div>
    );
  }
}

const MyInnerRenderer = props => (
  <span>{props.value}</span>
)

render(<GridExample />, document.querySelector("#root"));
