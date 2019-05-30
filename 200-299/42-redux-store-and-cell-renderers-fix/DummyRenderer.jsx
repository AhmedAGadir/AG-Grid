import React, { Component } from 'react';

class DummyRenderer extends Component{
  constructor(props) {
    super(props);
    this.state = {
      value: null
    }
  }

  componentWillMount() {
    this.setState({value: this.props.value});
  }

  refresh(params) {
    this.setState({value: params.value});
    return true;
  }

  render() {
    return <div>~{this.state.value}</div>; 
  }
}


export default DummyRenderer