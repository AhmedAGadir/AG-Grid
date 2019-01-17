import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import RowExpanderElement from '../../components/gridPane/components/rowExpanderElement';
import ApproveColorsPO from '../../components/approveColorsGridPane/components/approveColorsPO';
import StylePO from '../../components/styleGridPane/components/stylePO';
import { updateUserPreference } from '../../actions/userPreferenceActions';
import {addEntryInTabDetails, removeEntryInTabDetails, getGridTabDatas} from '../../actions/gridPaneActions';
import { hideUnhideImage } from '../../actions/approveColorsActions';
import { removeNewCPO } from '../../actions/gridPaneActions/cpoActions';
import { removeNewGPO } from '../../actions/gridPaneActions/gpoActions';
import { removeNewPO, createPOobjectSuccess } from '../../actions/gridPaneActions/poActions';
import { saveProductEditSuccess } from '../../actions/gridPaneActions/productActions';
import { PO_CREATE_TYPE } from '../../constants/POConstants';

/* eslint  react/prop-types: 0 */

class RowExpanderContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            identifier: null
        };
    }

    componentDidMount = () => {
        const identifier = this.props.node.rowModel.rowsToDisplay[this.props.rowIndex - 1].data[this.props.linePlan.identifier];
        this.setState({identifier});
        if (this.props.linePlan.name !== 'STYLE') {
            this.props.dispatch(addEntryInTabDetails(identifier));
        }
    }

    componentWillReceiveProps = (newProps) => {
        if (this.state.identifier !== null && this.state.identifier.toString().substring(0, 3).toLowerCase() === 'new') {
            this.setState({identifier: newProps.node.rowModel.rowsToDisplay[this.props.rowIndex - 1].data[this.props.linePlan.identifier]});
        }
    }

    componentWillUnmount() {
        if (this.state.identifier !== null && this.state.identifier.toString().substring(0, 3).toLowerCase() !== 'new' && this.props.linePlan.name !== 'APPROVE_COLORS' && !this.props.showPPTPaneView) {
            this.props.dispatch(removeEntryInTabDetails(this.state.identifier));
        }
    }

    updatePreference = (updatedColumns) => {
        this.props.dispatch(updateUserPreference(updatedColumns));
    }

    getUserPreference = () => {
        let preference = null;
        if (this.props.loginData.userPreferences !== undefined && this.props.loginData.userPreferences.length > 0) {
            this.props.loginData.userPreferences.forEach((preferenceData) => {
                if (preferenceData.userPreferenceType.id === 6) {
                    preference = preferenceData;
                }
            });
        }
        if (preference !== null) {
            return preference;
        }
        return null;
    }
    getGridTabDatas = (linePlanName, tabInfo, params, identifier) => {
        this.props.dispatch(getGridTabDatas(this.props.linePlan, tabInfo, params, identifier, this.props.data));
    }
    createAsianVersion = (data)=> {
        this.props.dispatch(createPOobjectSuccess(data, this.state.identifier, PO_CREATE_TYPE.CREATE_ASIAN_VERSION));
    }
    shareColorway = (data, modelOfferingId) =>{
        this.props.dispatch(saveProductEditSuccess(data, data.productId, false, modelOfferingId));
    }
    removeNewRow = (tabInfo, value, linePlanIdentifier) => {
        if (tabInfo.key === 'CPO') {
            this.props.removeObjectInState(value, false);
            this.props.dispatch(removeNewCPO(tabInfo.identifier, value, false, linePlanIdentifier));
        } else if (tabInfo.key === 'GPO') {
            this.props.removeObjectInState(value, false);
            this.props.dispatch(removeNewGPO(tabInfo.identifier, value, false, linePlanIdentifier));
        } else if (tabInfo.key === 'PO') {
            this.props.removeObjectInState(value, false);
            this.props.dispatch(removeNewPO(tabInfo.identifier, value, false, linePlanIdentifier));
        }
    }
    hideUnhideImage = (images, hide = true) => {
        this.props.dispatch(hideUnhideImage(images, hide, this.state.identifier));
    }
    render() {
        // const rowNode = this.props.api.getDisplayedRowAtIndex(this.props.rowIndex);
        const rowNode = this.props.node;
        if (this.props.linePlan.name === 'APPROVE_COLORS') {
            return <ApproveColorsPO stateName={this.props.stateName} getGridTabDatas={this.getGridTabDatas} updatePreference={this.updatePreference} identifier={this.state.identifier} data={this.props.data} linePlan={this.props.linePlan} preference={this.getUserPreference()} tabDetails={this.props.tabDetails[this.state.identifier]} searchData={this.props.searchData} hideUnhideImage={this.hideUnhideImage} mainGridData={this.props.gridData[this.props.linePlan.dataElementFromService]} rowNode={rowNode} gridApi={this.props.api} moveImageToUnlink={this.props.moveImageToUnlink} moveImageLinkFromUnlink={this.props.moveImageLinkFromUnlink} moveImageBtwProducts={this.props.moveImageBtwProducts} getApproveColorsObjs={this.props.getApproveColorsObjs} />;
        }
        if (this.props.linePlan.name === 'STYLE') {
            return <StylePO stateName={this.props.stateName} getGridTabDatas={this.getGridTabDatas} updatePreference={this.updatePreference} identifier={this.state.identifier} data={this.props.data} linePlan={this.props.linePlan} preference={this.getUserPreference()} searchData={this.props.searchData} hideUnhideImage={this.hideUnhideImage} rowNode={rowNode} gridApi={this.props.api}  />;
        }
        return (
            <RowExpanderElement stateName={this.props.stateName} removeNewRow={this.removeNewRow} togglePPTPane={this.props.togglePPTPane} getGridTabDatas={this.getGridTabDatas} updatePreference={this.updatePreference} identifier={this.state.identifier} data={this.props.data} linePlan={this.props.linePlan} preference={this.getUserPreference()} tabDetails={this.props.tabDetails[this.state.identifier]} searchData={this.props.searchData} currentProfile={this.props.currentProfile} mainGridData={this.props.gridData[this.props.linePlan.dataElementFromService]} saveMassEdits={this.props.saveMassEdits} rowNode={rowNode} gridApi={this.props.api} openNewPane={this.props.openNewPane} createAsianVersion={this.createAsianVersion} shareColorway={this.shareColorway}/>
        );
    }
}

RowExpanderContainer.propTypes = {
    dispatch: PropTypes.func.isRequired,
    linePlan: PropTypes.object.isRequired,
    loginData: PropTypes.object.isRequired,
    togglePPTPane: PropTypes.func,
    stateName: PropTypes.string.isRequired,
    removeObjectInState: PropTypes.func,
    searchData: PropTypes.object,
    api: PropTypes.object,
    node: PropTypes.object,
    moveImageToUnlink: PropTypes.func,
    moveImageLinkFromUnlink: PropTypes.func,
    moveImageBtwProducts: PropTypes.func,
    openNewPane: PropTypes.func,
    getApproveColorsObjs: PropTypes.func,
    currentProfile: PropTypes.object
};

function mapStateToProps(state) {
    return {
        loginData: state.userDetails.loginData,
        tabDetails: state.gridPaneDetails.tabDetails,
        gridData: state.paneDetails.gridData
    };
}

export default connect(mapStateToProps)(RowExpanderContainer);
