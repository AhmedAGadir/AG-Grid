import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import { updateRowData } from 'actions.js';
import DummyRenderer from "./DummyRenderer.jsx";

class Grid extends Component {
    state = {
    frameworkComponents: {
      DummyRenderer,
    },
  };
  
  onRowUpdate = () => {
    this.props.updateRowData();
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps', nextProps);
  }
  
  render() {
    return (
      <div style={{height: 400, width: 900, marginTop: 15}} className="ag-theme-balham">
      <button onClick={this.onRowUpdate}>Update Row Data </button>
      <AgGridReact
        columnDefs={this.props.columnDefs}
        rowData={this.props.rowData}
        animateRows
        deltaRowDataMode
        getRowNodeId={data => data.id}
        enableColResize
        frameworkComponents={this.state.frameworkComponents}
      />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { columnDefs, rowData } = state;
  return { columnDefs, rowData };
};

const mapDispatchToProps = {
  updateRowData
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Grid);
