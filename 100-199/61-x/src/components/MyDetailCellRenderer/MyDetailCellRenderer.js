import React, { Component } from 'react';

import MyFirstDetailGridTab from './tabs/MyFirstDetailGridTab/MyFirstDetailGridTab';
import MyNonGridTab from './tabs/MyNonGridTab/MyNonGridTab';
import MySecondDetailGridTab from './tabs/MySecondDetailGridTab/MySecondDetailGridTab';

import './MyDetailCellRenderer.css'

class MyDetailCellRenderer extends Component {
    state = {
        selectedComponent: 'gridTab1',
    }

    render() {
        let selected;
        switch (this.state.selectedComponent) {
            case 'gridTab1':
                selected = <MyFirstDetailGridTab {...this.props} />;
                break;
            case 'nonGridTab':
                selected = <MyNonGridTab />
                break;
            case 'gridTab2':
                selected = <MySecondDetailGridTab />
                break;
            default:
                selected = null;
        }

        return (
            <div className="detail-cell-renderer">
                <div>
                    <button onClick={() => this.setState({ selectedComponent: 'gridTab1' })}>Grid Tab 1</button>
                    <button onClick={() => this.setState({ selectedComponent: 'nonGridTab' })}>Non Grid Tab</button>
                    <button onClick={() => this.setState({ selectedComponent: 'gridTab2' })}>Grid Tab 2</button>
                </div>
                <div>
                    {selected}
                </div>
            </div>
        )
    }
}

export default MyDetailCellRenderer;