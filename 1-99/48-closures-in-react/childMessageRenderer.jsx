import React, {Component} from "react";

export default class ChildMessageRenderer extends Component {
    constructor(props) {
        super(props);
        this.invokeParentMethod = this.invokeParentMethod.bind(this);
    }

    invokeParentMethod() {
        this.props.callback();
    }

    render() {
        return (
            <span><button style={{height: 20, lineHeight: 0.5}} onClick={this.invokeParentMethod} className="btn btn-info">Invoke Parent</button></span>
        );
    }
};
