import React, {Component} from 'react';

export default class CustomHeaderComponent extends Component {
  render() {
    return (
      <button
        onClick={()=>console.log('header clicked')}
        class="btn btn-primary"
      >
        Click me
      </button>
    );
  }
}