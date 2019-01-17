/* eslint  no-unused-vars: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import {SUBGRID_TABS} from '../../../../constants/SubGridConstants';
import Loader from '../../../common/loader';
import './style.scss';
import SubGrid from './subGrid';
import _ from 'lodash';

import GMO from './GMO/index';
import MO from './MO/index';
import Model from './Model/index';
import subSearchIdentifiers from './subSearchIdentifiers';

/**
 * This is the component displays the content of sub grid.
 * @example
 *<RowExpanderElement stateName={this.props.stateName} removeNewRow={this.removeNewRow}
 *togglePPTPane={this.props.togglePPTPane} getGridTabDatas={this.getGridTabDatas}
 *updatePreference={this.updatePreference} identifier={this.state.identifier} data={this.props.data}
 *linePlan={this.props.linePlan} preference={this.getUserPreference()}
 *tabDetails={this.props.tabDetails[this.state.identifier]} searchData={this.props.searchData}
 *mainGridData={this.props.gridData[this.props.linePlan.dataElementFromService]}
 *saveMassEdits={this.props.saveMassEdits} rowNode={rowNode} gridApi={this.props.api} />
 */
class RowExpanderElement extends React.Component {
    /**
     * creates a instance of EditColorwayCode.
     * @param stateName
     * @param togglePPTPane
     * @param updatePreference
     */
    constructor(props) {
        super(props);
        /**
         * @type {object}
         * @property {boolean} isDataLoaded Flag for checking data is loaded or not
         * @property {string} tabDataLoaded - tab data
         * @property {array} activeTab- attribute which has active tab
         * @property {boolean} showLoader- Flag to show the spinning loader
         * @property {object} selectedObject- attribute which holds the selected object
         * @property {boolean} tabCliclkDone- Flag which checks tab is clicked or not
         */
        this.state = {
            isDataLoaded: false,
            tabDataLoaded: '',
            showLoader: false,
            activeTab: SUBGRID_TABS[props.linePlan.name][0],
            left: 0,
            selectedObject: null,
            tabCliclkDone: true
        };
    }

    /**
    * This function executes as soon as the component is loaded in UI.
    * Adds the event listeners for mouse events.
    */
    componentDidMount = () => {
        this.refs.tabContainer.addEventListener('mousemove', this.scrollContainer, false);
        this.refs.tabContainer.addEventListener('mouseout', () => {this.setState({left: 0});}, false);
    }

    /**
    * This function executes as soon as the prop object value chnages and updates the tab content data.
    */
    componentWillReceiveProps(newProps) {
        let hasValidIds = false;
        if (newProps.tabDetails !== undefined && newProps.tabDetails[SUBGRID_TABS[newProps.linePlan.name][0].name] !== undefined) {
            let element = 'countryProductOfferings';
            if (SUBGRID_TABS[newProps.linePlan.name][0].key === 'GPO') {
                element = 'geographyProductOfferings';
            } else if (SUBGRID_TABS[newProps.linePlan.name][0].key === 'PO') {
                element = 'productOfferings';
            } else if (SUBGRID_TABS[newProps.linePlan.name][0].key === 'Product') {
                element = 'products';
            } else if (SUBGRID_TABS[newProps.linePlan.name][0].key === 'MO') {
                element = 'modelOfferings';
            }
            const validElements = newProps.tabDetails[SUBGRID_TABS[newProps.linePlan.name][0].name][element].filter((row) => row[SUBGRID_TABS[newProps.linePlan.name][0].identifier].toString().substring(0, 3).toLowerCase() !== 'new');
            if (validElements.length > 0) {
                hasValidIds = true;
            }
        }
        if (newProps.tabDetails !== undefined && this.props.identifier !== newProps.identifier && newProps.identifier.toString().substring(0, 3).toLowerCase() !== 'new' && (newProps.tabDetails[SUBGRID_TABS[newProps.linePlan.name][0].name] === undefined || !hasValidIds)) {
            this.props.getGridTabDatas(newProps.linePlan.name, SUBGRID_TABS[newProps.linePlan.name][0], this.getParams(newProps), newProps.identifier);
            if (newProps.tabDetails[SUBGRID_TABS[newProps.linePlan.name][0].name] === undefined ) {
                this.setState({showLoader: true});
            }
        }

        if (this.props.tabDetails !== undefined && newProps.tabDetails !== undefined && (this.props.tabDetails[this.state.activeTab.key] !== newProps.tabDetails[this.state.activeTab.key])) {
            this.setState({showLoader: false});
        }
    }

    /**
    * This function executes just before the component is removed from UI.
    * Removes the event listeners for mouse events.
    */
    compoonentWillUnmount() {
        this.refs.tabContainer.removeEventListener('mousemove', this.scrollContainer, false);
        this.refs.tabContainer.removeEventListener('mouseout', () => {this.setState({left: 0});}, false);
    }

    /**
    * This function adds the scroll container to the tab content.
    */
    scrollContainer = (e) => {
        const cntWd = this.refs.tabContainer.offsetWidth;
        const listOWd = this.refs.navTabs.scrollWidth;
        const ulWidth  = listOWd - cntWd;
        const offsetLeft = this.refs.tabContainer.getBoundingClientRect().left;
        if (listOWd > cntWd) {
            const left = (e.pageX - offsetLeft);
            const percent = left / cntWd;
            this.setState({left: -(percent * ulWidth)});
        }
    }

    /**
    * This function gets the data for loading the tab contents.
    */
    getParams = (props) => {
        let params = '';
        if(this.props.linePlan.name === 'GLOBAL') {
            params = {[this.props.linePlan.identifier]: props.identifier, adoptedRegions: false, adoptionIntents: false};
        } else {
            params = {[this.props.linePlan.identifier]: props.identifier, adoptedRegions: false};
        }
        Object.keys(this.props.searchData).forEach(searchParamKey => {
            if (_.includes(subSearchIdentifiers[this.props.linePlan.name], searchParamKey)) {
                params[searchParamKey] = this.props.searchData[searchParamKey];
            }
        });
        return params;
    }

    /**
    * This function gets the request params based on line plan.
    */
    getRequestParams = (props) => {
        let params = {};
        switch (this.props.linePlan.name) {
            case 'COUNTRY':
                params = props.identifier;
                break;
            case 'GEO':
                params = props.identifier;
                break;
            case 'GLOBAL':
                params = props.identifier;
                break;
            default:
                params = {};
        }
        return params;
    }

    /**
    * This function loads the tab content(subgrid or the object) based on tab selection.
    */
    getComponent = (tab) => {
        if (tab.type === 'grid') {
            return (<SubGrid tab={tab}
                removeNewRow={this.props.removeNewRow}
                identifier={this.props.identifier}
                stateName={this.props.stateName}
                togglePPTPane={this.props.togglePPTPane}
                tabDatas={this.state.tabCliclkDone && (this.props.tabDetails !== undefined && this.props.tabDetails[tab.name]) ? this.props.tabDetails[tab.name] : {}}
                linePlan={this.props.linePlan}
                selectedObject={this.state.selectedObject}
                tabClick={(e, coldata) => this.handleTabClick(e, coldata)}
                preference={this.props.preference}
                updatePreference={this.props.updatePreference}
                searchData={this.props.searchData}
                mainGridData={this.props.mainGridData}
                saveMassEdits={this.props.saveMassEdits}
                createAsianVersion={this.props.createAsianVersion}
                shareColorway={this.props.shareColorway}
                rowNode={this.props.rowNode}
                gridApi={this.props.gridApi}
                openNewPane={this.props.openNewPane}
                activeTab={this.state.activeTab}
                showLoader={this.setLoaderState}
                currentProfile={this.props.currentProfile}/>);
        } else if(tab.key === 'GMO') {
            return(<GMO tab={tab} identifier={this.props.identifier} togglePPTPane={this.props.togglePPTPane} tabDatas={(this.props.tabDetails !== undefined && this.props.tabDetails[tab.key] !== undefined) ? this.props.tabDetails[tab.key] : {}} linePlan={this.props.linePlan} preference={this.props.preference} updatePreference={this.props.updatePreference} openNewPane={this.props.openNewPane}/>);
        } else if(tab.key === 'MO') {
            return(<MO tab={tab} identifier={this.props.identifier} togglePPTPane={this.props.togglePPTPane} tabDatas={(this.props.tabDetails !== undefined && this.props.tabDetails[tab.key] !== undefined) ? this.props.tabDetails[tab.key] : {}} linePlan={this.props.linePlan} preference={this.props.preference} updatePreference={this.props.updatePreference} openNewPane={this.props.openNewPane}/>);
        } else if(tab.key === 'Model') {
            return(<Model tab={tab} identifier={this.props.identifier} togglePPTPane={this.props.togglePPTPane} tabDatas={(this.props.tabDetails !== undefined && this.props.tabDetails[tab.key] !== undefined) ? this.props.tabDetails[tab.key] : {}} linePlan={this.props.linePlan} preference={this.props.preference} updatePreference={this.props.updatePreference} openNewPane={this.props.openNewPane}/>);
        } else if(tab.type === 'history') {
            return (
                <SubGrid
                    tab={tab}
                    removeNewRow={this.props.removeNewRow}
                    identifier={this.props.identifier}
                    stateName={this.props.stateName}
                    getHistoryData={this.getHistoryData}
                    togglePPTPane={this.props.togglePPTPane}
                    data={this.props.data}
                    allTabData={this.props.tabDetails}
                    tabDatas={(this.props.tabDetails !== undefined && this.props.tabDetails[tab.name] !== undefined) ? this.props.tabDetails[tab.name] : {}}
                    linePlan={this.props.linePlan}
                    preference={this.props.preference}
                    updatePreference={this.props.updatePreference}
                    entitySearch={(entityName) => {
                        const tabInfo = SUBGRID_TABS[this.props.linePlan.name]
                            .filter(entity => entity.name === (entityName === 'CMO' ? 'MO' : entityName))[0];
                        this.getEntityData(tabInfo);
                    }}
                    rowNode={this.props.rowNode}
                    mainGridData={this.props.mainGridData}
                    gridApi={this.props.gridApi}
                    activeTab={this.state.activeTab}
                    showLoader={this.setLoaderState}
                />);
        }
        return 'None';
    }

    /**
    * This function sets the state of the tab loader.
    */
    setLoaderState = (show) => {
        this.setState({showLoader: show});
    }

    /**
    * This function gets the history tab data.
    */
    getHistoryData = (entityType, entitySK) => {
        const params = {entityType, entitySK};
        const tabInfo = SUBGRID_TABS[this.props.linePlan.name].filter(tab => tab.name === 'History')[0];
        if (this.props.identifier.toString().substring(0, 3).toLowerCase() !== 'new') {
            this.props.getGridTabDatas(this.props.linePlan.name, tabInfo, params, this.props.identifier);
            this.setState({showLoader: true});
        }
    }

    /**
    * This function gets the tab key identifier.
    */
    getTabKey = (tabInfo) => {
        const tabIndex = SUBGRID_TABS[this.props.linePlan.name].map((tab) => {
            return tab.key;
        }).indexOf(tabInfo.key);
        return(tabIndex);
    }

    /**
    * This function gets the grid tab tab data for the selected tab.
    */
    getEntityData = (tabInfo) => {
        if (tabInfo.type === 'grid' ) {
            this.props.getGridTabDatas(this.props.linePlan.name, tabInfo, this.getParams(this.props), this.props.identifier);
        } else if((tabInfo.key === 'GMO' || tabInfo.key === 'MO' || tabInfo.key === 'Model')) {
            this.props.getGridTabDatas(this.props.linePlan.name, tabInfo, this.getRequestParams(this.props), this.props.identifier);
        }
    }

    /**
    * This function gets the row count of the grid in the selected tab.
    */
    getCount = (tabInfo) => {
        let rowCount = '';
        let rows = [];
        if(this.props.tabDetails && this.props.tabDetails[tabInfo.name] !== undefined && (tabInfo.type === 'grid')) {
            switch (tabInfo.key) {
                case 'CPO':
                    rows = this.props.tabDetails[tabInfo.name].countryProductOfferings;
                    const rowCountCPO = rows.length;
                    rowCount = ` (${rowCountCPO})`;
                    break;
                case 'GPO':
                    rows = this.props.tabDetails[tabInfo.name].geographyProductOfferings;
                    const rowCountGPO = rows.length;
                    rowCount = ` (${rowCountGPO})`;
                    break;
                case 'PO':
                    rows = this.props.tabDetails[tabInfo.name].productOfferings;
                    const rowCountPO = rows.length;
                    rowCount = ` (${rowCountPO})`;
                    break;
                case 'Product':
                    rows = this.props.tabDetails[tabInfo.name].products;
                    const rowCountPro = rows.length;
                    rowCount = ` (${rowCountPro})`;
                    break;
                case 'MO':
                    rows = this.props.tabDetails[tabInfo.name].modelOfferings;
                    const rowCountMO = rows.length;
                    rowCount = ` (${rowCountMO})`;
                    break;
                default:
                    rowCount = '';
            }
        }
        return rowCount;
    }

    /**
    * This function handles the tab click and loads the required data.
    */
    handleTabClick = (tabInfo, selectedObject = null) => {
        let showLoader = false;
        let rowHeight = 380;
        if (tabInfo.type === 'grid') {
            rowHeight = 135;
        } else if (tabInfo.type === 'history') {
            rowHeight = 164;
        }
        if (this.props.tabDetails[tabInfo.name] === undefined && this.props.identifier.toString().substring(0, 3).toLowerCase() !== 'new') {
            if (tabInfo.type !== 'history') {
                showLoader = true;
            }
            this.getEntityData(tabInfo);
        } else if (this.props.tabDetails[tabInfo.name] !== undefined && (tabInfo.type === 'grid' || tabInfo.type === 'history')) {
            let rows = [];
            switch (tabInfo.key) {
                case 'CPO':
                    rows = this.props.tabDetails[tabInfo.name].countryProductOfferings;
                    break;
                case 'GPO':
                    rows = this.props.tabDetails[tabInfo.name].geographyProductOfferings;
                    break;
                case 'PO':
                    rows = this.props.tabDetails[tabInfo.name].productOfferings;
                    break;
                case 'Product':
                    rows = this.props.tabDetails[tabInfo.name].products;
                    break;
                case 'History':
                    rows = this.props.tabDetails[tabInfo.name].changes;
                    break;
                case 'MO':
                    rows = this.props.tabDetails[tabInfo.name].modelOfferings;
                    break;
                default:
                    rows = [];
            }
            if (rows.length < 25 && rows.length > 1) {
                rowHeight = rowHeight + ((rows.length - 1) * 25);
            }
            if (rows.length > 25) {
                rowHeight = rowHeight + (25 * 25);
            }
        }
        this.setState({tabCliclkDone: false, activeTab: tabInfo, showLoader, selectedObject}, () => {
            setTimeout(() => {this.setState({tabCliclkDone: true});}, 1);
            if (this.props.rowNode.detailNode) {
                setTimeout(() => {this.props.rowNode.detailNode.setRowHeight(rowHeight);}, 1);
            } else {
                setTimeout(() => {this.props.rowNode.setRowHeight(rowHeight);}, 1);
            }
            this.props.gridApi.onRowHeightChanged();
        });
    }
    /**
     * render
     * @return {ReactElement} markup
     */
    render() {
        const tabClass = 'tab-pane fadeIn';
        let loader = null;
        if (this.state.showLoader) {
            loader = <Loader showLoader={this.state.showLoader} />;
        }
        const tabContainerClass = ['tabContainer'];
        if (this.state.activeTab.type !== 'grid' && this.state.activeTab.type !== 'history') {
            tabContainerClass.push('notAGrid');
        }
        return (
            <div ref="childElementsContainer">
                <div className="tabsSection rowExpanderContainer" >
                    <div className={tabContainerClass.join(' ')} ref="tabContainer">
                        <ul className="nav nav-tabs" ref="navTabs" data-tabs="tabs" id="tabs" style={{left: this.state.left + 'px'}} >
                            {SUBGRID_TABS[this.props.linePlan.name].map((tab, i) =>
                                (tab.showForNewObject || (!tab.showForNewObject && this.props.identifier !== null && this.props.identifier.toString().substring(0, 3).toLowerCase() !== 'new')) && <li key={i} className={(i === this.getTabKey(this.state.activeTab)) ? 'active' : ''}>
                                    <a href={ '#' + this.props.stateName + '_' + tab.name + '_' + this.props.identifier } data-toggle="tab" className={tab.styleName} onClick={() => {this.handleTabClick(tab);}}>{tab.name}
                                        {this.getCount(tab)}</a>
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className="tab-content" >
                        {loader}
                        {SUBGRID_TABS[this.props.linePlan.name].map((tab, i) =>
                            (tab.showForNewObject || (!tab.showForNewObject && this.props.identifier !== null && this.props.identifier.toString().substring(0, 3).toLowerCase() !== 'new')) && <div key={i} data-e2e={tab.name} id={this.props.stateName + '_' + tab.name + '_' + this.props.identifier}  className={(i === this.getTabKey(this.state.activeTab)) ? 'active ' + tabClass : tabClass}>
                                {this.getComponent(tab)}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

RowExpanderElement.propTypes = {
    linePlan: PropTypes.object,
    data: PropTypes.object,
    identifier: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    tabDetails: PropTypes.object,
    getGridTabDatas: PropTypes.func,
    preference: PropTypes.object,
    updatePreference: PropTypes.func,
    saveMassEdits: PropTypes.func,
    togglePPTPane: PropTypes.func,
    stateName: PropTypes.string.isRequired,
    removeNewRow: PropTypes.func,
    searchData: PropTypes.object,
    mainGridData: PropTypes.array,
    rowNode: PropTypes.object,
    gridApi: PropTypes.object,
    objectId: PropTypes.func,
    openNewPane: PropTypes.func,
    createAsianVersion: PropTypes.func,
    shareColorway: PropTypes.func,
    currentProfile: PropTypes.object
};

export default RowExpanderElement;
