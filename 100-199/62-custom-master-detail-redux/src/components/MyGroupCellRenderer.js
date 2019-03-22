import React, { Component } from 'react';

class MyGroupCellRenderer extends Component {
    state = {
        expanded: false
    }

    componentDidUpdate() {
        this.props.node.setExpanded(this.state.expanded);
    }

    toggleExpanded() {
        this.setState(prevState => ({
            expanded: !prevState.expanded
        }));
    }

    render() {
        return <div
            style={{ textAlign: 'center' }}
            onClick={this.toggleExpanded.bind(this)}>+</div>
    }
}

export default MyGroupCellRenderer;