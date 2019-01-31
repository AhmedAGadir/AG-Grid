import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import columnDefs from "./col-defs";
import rowData from "./row-data";
import WeekCellRender from "./cell-render";
import { filter, find, indexOf, map, max } from "lodash";
import update from "immutability-helper";

class Grid extends Component {
  constructor() {
    super(...arguments);

    this.state = {
      columnDefs,
      rowData,
      context: { parent: this },
      frameworkComponents: {
        weekCellRender: WeekCellRender
      }
    };
  }

  componentDidUpdate() {
    setTimeout(() => {
      this.api.resetRowHeights();
    }, 500);
  }

  onGridReady = params => {
    this.api = params.api;
    setTimeout(() => {
      params.api.resetRowHeights();
    }, 500);
  };

  onWeekDrop = (from, to) => {
    let rowData = [...this.state.rowData];

    if (
      from.column === to.column &&
      from.data.id === to.data.id &&
      from.data.priorityId === to.data.priorityId
    ) {
      return;
    }

    const source = find(rowData, row => {
      return from.data.id === row.id && from.data.priorityId === row.priorityId;
    });
    const sourceIndex = indexOf(rowData, source);

    const destination = find(rowData, row => {
      return to.data.id === row.id && to.data.priorityId === row.priorityId;
    });
    const destinationIndex = indexOf(rowData, destination);

    const sourceWeek = source[from.column];

    let sourceItem = find(sourceWeek, week => {
      return from.week.id === week.id;
    });

    const sourceWeeks = filter(sourceWeek, week => {
      return from.week.id !== week.id;
    });

    const destinationWeek = destination[to.column];
    const destinationIds = map(destinationWeek, "id");
    const maxId = max(destinationIds);

    sourceItem = { ...sourceItem };
    sourceItem.id = maxId + 1;

    if (sourceIndex === destinationIndex) {
      rowData = update(rowData, {
        [sourceIndex]: {
          [from.column]: {
            $set: sourceWeeks
          },
          [to.column]: {
            $push: [sourceItem]
          }
        }
      });
    } else {
      rowData = update(rowData, {
        [sourceIndex]: {
          [from.column]: {
            $set: sourceWeeks
          }
        },
        [destinationIndex]: {
          [to.column]: {
            $push: [sourceItem]
          }
        }
      });
    }

    this.setState({ rowData });
  };

  render() {
    return (
      <div className="my-grid">
        <div
          className="ag-theme-balham"
          style={{
            height: "calc(100vh - 30px)",
            width: "100%"
          }}
        >
          <AgGridReact
            onGridReady={this.onGridReady}
            columnDefs={this.state.columnDefs}
            context={this.state.context}
            rowData={this.state.rowData}
            frameworkComponents={this.state.frameworkComponents}
            suppressRowTransform={true}
          />
        </div>
      </div>
    );
  }
}

export default Grid;
