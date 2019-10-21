import React, { Component } from 'react';
import MyDetailGridTab from './tabs/MyDetailGridTab/MyDetailGridTab';
import MyNonGridTab from './tabs/MyNonGridTab/MyNonGridTab';
import './MyDetailCellRenderer.css'

class MyDetailCellRenderer extends Component {
    state = {
        selectedComponent: 'gridTab1',
    }

    setDetailRowHeight(newHeight) {
        this.props.node.setRowHeight(newHeight);
        this.props.api.onRowHeightChanged();
    }

    componentWillMount() {
        console.log('[componentWillMount]MyDetailCellRenderer')
    }

    componentWillReceiveProps(nextProps) {
        console.log('[componentWillReceiveProps]MyDetailCellRenderer', nextProps)
    }

    refresh() {
        console.log('refreshing');
        return true;
    }

    render() {
        let selected;
        switch (this.state.selectedComponent) {
            case 'gridTab1':
                selected = <MyDetailGridTab
                    {...this.props}
                    gridParams={this.props.data.detail.gridTab1}
                    tab="gridTab1"
                    setDetailRowHeight={this.setDetailRowHeight.bind(this)} />;
                break;
            case 'nonGridTab':
                selected = <MyNonGridTab
                    {...this.props}
                    imgUrl={this.props.data.detail.nonGridTab.imageURL}
                    imgTitle={this.props.data.detail.nonGridTab.name}
                    setDetailRowHeight={this.setDetailRowHeight.bind(this)} />
                break;
            case 'gridTab2':
                selected = <MyDetailGridTab
                    {...this.props}
                    gridParams={this.props.data.detail.gridTab2}
                    tab="gridTab2"
                    setDetailRowHeight={this.setDetailRowHeight.bind(this)} />;
                break;
            default:
                selected = null;
        }

        return (
            <div className="detail-cell-renderer">
                <div className="btn-wrap">
                    <button
                        className={this.state.selectedComponent === 'gridTab1' ? 'btn btn-info' : 'btn btn-primary'}
                        onClick={() => this.setState({ selectedComponent: 'gridTab1' })}>Grid Tab 1</button>
                    <button
                        className={this.state.selectedComponent === 'nonGridTab' ? 'btn btn-info' : 'btn btn-primary'}
                        onClick={() => this.setState({ selectedComponent: 'nonGridTab' })}>Non Grid Tab</button>
                    <button
                        className={this.state.selectedComponent === 'gridTab2' ? 'btn btn-info' : 'btn btn-primary'}
                        onClick={() => this.setState({ selectedComponent: 'gridTab2' })}>Grid Tab 2</button>
                </div>
                <div>
                    {selected}
                </div>
            </div>
        )
    }
}

export default MyDetailCellRenderer;