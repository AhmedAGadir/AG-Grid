import React, { Component } from 'react';
import { connect } from 'react-redux';

class MyCustomFloatingFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
    }

    onParentModelChanged = parentModel => {
        this.setState({ value: parentModel ? parentModel.filter : '' });
    }

    onChangeHandler = e => {
        let onFloatingFilterChangedParams = null;
        if (e.target.value !== '') {
            onFloatingFilterChangedParams =
                {
                    model: {
                        type: "contains",
                        filter: e.target.value,
                        filterType: "text"
                    }
                };
        }
        this.props.onFloatingFilterChanged(onFloatingFilterChangedParams);
    }

    render() {
        let input = null;
        if (this.props.isFilterVisible) {
            input = <input value={this.state.value} onChange={this.onChangeHandler} type="text" />
        }
        return input;
    }
}

const mapStateToProps = state => {
    return {
        isFilterVisible: state.isFilterVisible
    }
}

export default connect(mapStateToProps)(MyCustomFloatingFilter);