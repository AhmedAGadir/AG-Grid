import React, { Component } from 'react';
import List from './List';
import { connect } from 'react-redux';

class App extends Component {
    // state = {
    //     values: [1,2,3,4,5]
    // }

    updateValues = () => {
        let arr = [];
        let x = 0;
        while (x < 5) {
            arr.push(Math.floor(Math.random() * 5))
            x++
        }
        this.props.onUpdateVals(arr)
    }

    render() {
        return (
            <div>
                <List values={this.props.vals} />
                <button onClick={this.updateValues}>update values</button>
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        vals: state.values
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onUpdateVals: (arr) => dispatch({ type: 'UPDATE_LIST_VALS', arr: arr })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
