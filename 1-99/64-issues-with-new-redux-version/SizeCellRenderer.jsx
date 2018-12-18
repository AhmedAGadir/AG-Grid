import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types'

class SizeCellRenderer extends Component {

    render() {
        return (
            <div>{this.props.value}</div>
        )
    }
}

SizeCellRenderer.contextTypes = {
    store: PropTypes.object
}

const mapStateToProps = state => ({
    files: state.files
})

export default connect(mapStateToProps)(SizeCellRenderer);