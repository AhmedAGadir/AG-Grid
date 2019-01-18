import React, { Component } from 'react';

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

    onInputChangeHandler = e => {
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

    onButtonClickHandler = () => {
        this.props.toggleFloatingFilter(this.props.column.columnApi, this.props.column);
    }


    render() {
        const isFloatingFilterVisible = this.props.column.colDef.isFloatingFilterVisible;
        return (
            <div>
                <button onClick={this.onButtonClickHandler}>{isFloatingFilterVisible ? 'hide filter' : 'show filter'}</button>
                {isFloatingFilterVisible ?
                    <input
                        value={this.state.value}
                        onChange={this.onInputChangeHandler}
                        style={{ width: '115px' }}
                        type="text" />
                    : null
                }
            </div>
        );
    }
}

export default MyCustomFloatingFilter;
