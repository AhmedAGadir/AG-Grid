import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.counter = 1;
  }
  clickHandler() {
    const counter = this.counter++;
    return () => {
      console.log('clicked', counter)
    }
  }
  render() {
    return (
      <div>
        {[1, 2, 3, 4, 5].map(num => (
          <button
            key={num.toString()}
            onClick={this.clickHandler()}>number {num}</button>
        ))}
      </div>
    );
  }
}

export default App;
