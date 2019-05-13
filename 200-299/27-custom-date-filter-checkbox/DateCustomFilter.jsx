import React, { Component } from 'react';

export default class DateCustomFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      yesterday: false,
      today: false,
      tomorrow: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    this.props.api.onFilterChanged();
  }

  doesFilterPass(params) {
    const today = new Date();

    return this.state.today && today.toLocaleDateString() === params.data.date ||
      this.state.yesterday && new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1).toLocaleDateString() === params.data.date ||
      this.state.tomorrow && new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toLocaleDateString() === params.data.date
  }

  setModel(model) {
    let newState = {};
    Object.keys(this.state).forEach(checkbox => newState[checkbox] = model ? model[checkbox] : false);
    this.setState(newState);
  }

  isFilterActive() {
    return Object.keys(this.state).some(checkbox => this.state[checkbox]);
  }

  getModel() {
    return this.state;
  }

  toggleCheck(day) {
    this.setState(prevState => ({ [day]: !prevState[day] }));
  }

  render() {
    return (
      <div>
        <input
          type="checkbox"
          value="yesterday"
          onChange={() => this.toggleCheck('yesterday')}
          checked={this.state.yesterday} /> yesterday
        <br />
        <input
          type="checkbox"
          value="today"
          onChange={() => this.toggleCheck('today')}
          checked={this.state.today} /> today
        <br />
        <input
          type="checkbox"
          value="tomorrow"
          onChange={() => this.toggleCheck('tomorrow')}
          checked={this.state.tomorrow} /> tomorrow
      </div>
    );
  }
}
