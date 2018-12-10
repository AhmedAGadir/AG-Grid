import React, {Component} from 'react';

export default class GenderCellRenderer extends Component {
    constructor(props) {
        super(props)
    }

    render() {
     // console.log(this.props.value);
        return (
            <span>
              <i class={this.props.value}></i>
            </span>
        );
    }
}

