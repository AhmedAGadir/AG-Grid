import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

class CellRenderer extends React.Component {

    state = {
        value: this.props.value
    }

    componentWillMount() {
        console.log('componentWillMount')
    }

    componentWillReceiveProps() {
        console.log('componentWillReceiveProps')
    }

    componentWillUnmount() {
        console.log('componentWillUnmount')
    }

    refresh(params) {
        console.log('refresh', params)
        this.setState({ value: params.value })
        return true;
    }

    render() {
        const tooltip = <div>{this.state.value}!</div>;
        return (
            <Tooltip title={tooltip} placement='right'>
                <Typography>
                    {this.state.value}
                </Typography>
            </Tooltip>
        );
    }
};

export default CellRenderer;
