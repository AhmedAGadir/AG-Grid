import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from './actions/motorActions.jsx';
import GridComp from './gridComp.jsx';

const mapStateToProps = state => ({ motor: state.motor });
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
});

class Grid extends Component {
  constructor(props) {
    super(props);
    this.gridApiRef = [];
  }

  onGridReady(params) {
    this.gridApiRef.push(params.api);
  }

  onCellValueChanged(params) {
    this.gridApiRef.forEach(gridApi => {
      gridApi.refreshCells({
        columns: [params.column.colId],
        rowNodes: [gridApi.getRowNode(params.node.id)],
        // force: true
      });
    });
  }

  render() {
    return (
      <div>
        <GridComp 
          rowData={this.props.motor} 
          onCellValueChanged={this.onCellValueChanged.bind(this)}
          onGridReady={this.onGridReady.bind(this)}
          />
        <GridComp 
          rowData={this.props.motor} 
          onCellValueChanged={this.onCellValueChanged.bind(this)}
          onGridReady={this.onGridReady.bind(this)}
          />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Grid);
