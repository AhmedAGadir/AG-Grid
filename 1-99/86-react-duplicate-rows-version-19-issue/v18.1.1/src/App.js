import React, { Component } from 'react';
import MyMainGrid from './MyMainGrid'
class App extends Component {
    state = {
        rowDatas: [{
            test: 'componentDidMount',
            uniqueId: 'componentDidMount'
        }]
    }

    updateRowDataHandler = () => {
        this.setState({
            rowDatas: [{
                test: 'componentWillRecieveProps',
                uniqueId: 'componentDidMount'
            }]
        })
    }

    render() {
        return (
            <div>
                <button onClick={this.updateRowDataHandler}>Update Row Data</button>
                <MyMainGrid rowDatas={this.state.rowDatas} />
            </div>
        )
    }
}

export default App

