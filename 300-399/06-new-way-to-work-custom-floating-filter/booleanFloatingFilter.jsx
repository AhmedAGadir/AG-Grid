import React, { Component } from 'react';

const BOOLEAN_FILTER_DEFAULT_VALUE = 'all';
const BOOLEAN_FILTER_TRUE = 'true';
const BOOLEAN_FILTER_FALSE = 'false';

export default class BooleanFloatingFilter extends Component {
  state = {
    currentValue: BOOLEAN_FILTER_DEFAULT_VALUE,
  };

  valueChanged = event => {
    this.setState(
      {
        currentValue: event.target.value,
      },
      () => {
        const currentValue = this.state.currentValue;

        this.props.parentFilterInstance(filterInstance => {
          // filterInstance.selectValue(currentValue);
          // filterInstance.applyModel();
          // this.props.api.onFilterChanged();

          filterInstance.setModel({
            type: 'set',
            values: [currentValue],
          });
          this.props.api.onFilterChanged();
        });

        // UNTIL v.20 it worked this way:
        // this.props.onFloatingFilterChanged({ model: this.buildModel() })
      }
    );
  };

  onParentModelChanged(parentModel) {}

  buildModel() {
    if (this.state.currentValue === BOOLEAN_FILTER_DEFAULT_VALUE) {
      return null;
    }
    return {
      filterType: 'set',
      values: [this.state.currentValue],
    };
  }

  render() {
    return (
      <select
        style={{ width: '100%' }}
        onChange={this.valueChanged}
        value={this.state.currentValue}
      >
        <option value={BOOLEAN_FILTER_DEFAULT_VALUE}>all</option>
        <option value={BOOLEAN_FILTER_TRUE}>true</option>
        <option value={BOOLEAN_FILTER_FALSE}>false</option>
      </select>
    );
  }
}
