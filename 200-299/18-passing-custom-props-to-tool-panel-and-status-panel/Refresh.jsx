import React, { Component } from 'react';

export default class GridRefresh extends Component {


    handleClick = () => {
        this.props.componentParent.refresh();
        this.props.api.closeToolPanel();
    }

    render() {
        return (
            <span className="component">
                <input type="button" onClick={this.handleClick.bind(this)} value="Refresh" />
            </span>
        );
    }
};