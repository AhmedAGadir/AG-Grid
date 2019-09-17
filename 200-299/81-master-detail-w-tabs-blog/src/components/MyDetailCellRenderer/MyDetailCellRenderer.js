import React, { Component } from 'react';
import MyDetailGridTab from '../MyDetailGridTab';
import './MyDetailCellRenderer.css'

class MyDetailCellRenderer extends Component {
    state = {
        selectedComponent: 'contacts',
    }

    render() {

        return (
            <div className="detail-cell-renderer">
                <div className="btn-wrap">
                    <button
                        className={this.state.selectedComponent === 'contacts' ? 'btn btn-info' : 'btn btn-primary'}
                        onClick={() => this.setState({ selectedComponent: 'contacts' })}>Contacts</button>
                    <button
                        className={this.state.selectedComponent === 'profileRespApis' ? 'btn btn-info' : 'btn btn-primary'}
                        onClick={() => this.setState({ selectedComponent: 'profileRespApis' })}>Profile Resp Apis</button>
                </div>
                <div>
                    <MyDetailGridTab
                        {...this.props}
                        rowData={this.props.data[this.state.selectedComponent]}
                        tab={this.state.selectedComponent} />
                </div>
            </div>
        )
    }
}

export default MyDetailCellRenderer;