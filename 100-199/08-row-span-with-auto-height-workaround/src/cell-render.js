import React, { Component } from "react";
import ReactDOM from "react-dom";

class WeekCellRender extends Component {
  onDragStart = (ev, column, week, data) => {
    ev.dataTransfer.setData(
      "text",
      JSON.stringify({
        column,
        week,
        data
      })
    );
  };

  onDrop = (ev, column, data) => {
    ev.preventDefault();
    let from = ev.dataTransfer.getData("text");
    from = JSON.parse(from);

    this.props.context.parent.onWeekDrop(from, {
      column,
      data
    });
  };

  onDragOver = ev => {
    ev.preventDefault();
  };

  render() {
    const columnName = this.props.colDef.columnName;
    const weeks = this.props.data[columnName];
    const data = this.props.data;
    const id = `${data.id}-${data.priorityId}-${columnName}`;

    return (
      <div>
        <p>Draggable {columnName}</p>
        <div
          onDragOver={this.onDragOver}
          onDrop={ev => this.onDrop(ev, columnName, data)}
        >
          {weeks.map((item, index) => (
            <div
              key={`${id}-${item.id}`}
              draggable="true"
              onDragStart={ev => this.onDragStart(ev, columnName, item, data)}
              className="chip"
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default WeekCellRender;
