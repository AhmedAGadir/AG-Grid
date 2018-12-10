import React, { Component } from 'react';
import List from './List';

class App extends Component {
    state = {
        values: [1,2,3,4,5]
    }

    updateValues = () => {
        let arr = [];
        let x = 0;
        while (x < 5) {
            arr.push(Math.floor(Math.random() * 5))
            x++
        }
        this.setState({
            values: arr
        })
    }

    render() {
        return (
            <div>
                <List values={this.state.values} />
                <button onClick={this.updateValues}>update values</button>
            </div>
        )
    }
  
}

export default App
