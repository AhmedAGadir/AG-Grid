import React, { Component } from 'react';
import MyDetailGrid from './MyDetailGrid';

class MyFullWidthCellRenderer extends Component {

    componentWillReceiveProps() {
        console.log('[MyFullWidthCellRenderer] componentWillReceiveProps')
    }

    render() {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center'
            }}>
                <button onClick={this.props.updateRowData}>update row data</button>
                <MyDetailGrid rowDatas={this.props.data.rowDatas} />
            </div>
        );
    }

};

export default MyFullWidthCellRenderer;