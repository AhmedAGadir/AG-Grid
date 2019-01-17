import { ACTIONS } from '../constants/paneConstants';
import { STYLE_ACTIONS } from '../constants/styleConstants';
import { MO_ACTIONS } from '../constants/MOConstants';
import { PO_ACTIONS } from '../constants/POConstants';
import { ACTIONS as SEARCH_PANE_ACTIONS } from '../constants/searchPaneConstants';
// import { LINE_PLANS_CONFIG } from '../constants/appConstants';
import { combineReducers } from 'redux';
import gridPaneDetails from './gridPaneReducer';
import CMO_GRID_MAPPING_L1_FROM_L3 from '../constants/L1FromL3Mappings/CMO';
import CPO_GRID_MAPPING_L1_FROM_L3 from '../constants/L1FromL3Mappings/CPO';
import GPO_GRID_MAPPING_L1_FROM_L3 from '../constants/L1FromL3Mappings/GPO';
import GMO_GRID_MAPPING_L1_FROM_L3 from '../constants/L1FromL3Mappings/GMO';
import MO_GRID_MAPPING_L1_FROM_L3 from '../constants/L1FromL3Mappings/MO';
import PO_GRID_MAPPING_L1_FROM_L3 from '../constants/L1FromL3Mappings/PO';
import MODEL_GRID_MAPPING_L1_FROM_L3 from '../constants/L1FromL3Mappings/MODEL';
import PRODUCT_GRID_MAPPING_L1_FROM_L3 from '../constants/L1FromL3Mappings/PRODUCT';
import PO_FROM_PRODUCT_L1_FROM_L3 from '../constants/L1FromL3Mappings/PO_FROM_PRODUCT';
import STYLE_GRID_MAPPING_L1_FROM_L3 from '../constants/L1FromL3Mappings/STYLE';
import PO_FROM_PRODUCT_GRID_MAPPING_L1_FROM_L3 from '../constants/L1FromL3Mappings/PO_FROM_PRODUCT';

import update from 'immutability-helper';
import DB from  '../services/DBService';
// import MessageService, {messageTypes} from  '../services/messagingService';
import _ from 'lodash';
import { LINE_PLANS_CONFIG } from '../constants/appConstants';

const _DB = DB.getInstance();
const initialState = {
    sampleData: 0,
    defaultLinePlan: {
        id: 0,
        name: '',
        displayLabel: '',
        shortenDisplayLabel: '',
        color: '',
        className: ''
    },
    gridData: {}
};

/**
 * This function will handle the update process of the grid data.
 * @param {object} state - handle the current reducer state dats
 * @param {object} action - handle the action received with the datas to update the grid
 * @param {string} type - This will represent the type of grid to update
 */
function updateGrid(state, action, type) {
    let datas = (state.gridData[state.defaultLinePlan.dataElementFromService] !== undefined) ? state.gridData[state.defaultLinePlan.dataElementFromService].slice() : [];
    let mappings = {};
    let identifier = state.defaultLinePlan.identifier;
    if (type === 'CMO') {
        mappings = CMO_GRID_MAPPING_L1_FROM_L3;
    } else if (type === 'GMO') {
        mappings = GMO_GRID_MAPPING_L1_FROM_L3;
    } else if (type === 'MODEL') {
        mappings = MODEL_GRID_MAPPING_L1_FROM_L3;
    } else if (type === 'MO') {
        mappings = MO_GRID_MAPPING_L1_FROM_L3;
    } else if (type === 'PRODUCT') {
        mappings = PRODUCT_GRID_MAPPING_L1_FROM_L3;
    } else if (type === 'STYLE') {
        mappings = STYLE_GRID_MAPPING_L1_FROM_L3;
    } else if (type === 'CPO') {
        mappings = CPO_GRID_MAPPING_L1_FROM_L3;
        /**
         * Condition check to update parent CMO grid from child CPO grid update
         */
        if (state.gridData.countryModelOfferings !== undefined) {
            datas = (state.gridData.countryModelOfferings !== undefined) ? state.gridData.countryModelOfferings.slice() : [];
            mappings = CMO_GRID_MAPPING_L1_FROM_L3;
            identifier = 'cmoId';
        }
    } else if (type === 'GPO') {
        mappings = GPO_GRID_MAPPING_L1_FROM_L3;
        /**
         * Condition check to update parent GMO grid from child GPO grid update
         */
        if (state.gridData.geographyModelOfferings !== undefined) {
            datas = (state.gridData.geographyModelOfferings !== undefined) ? state.gridData.geographyModelOfferings.slice() : [];
            mappings = GMO_GRID_MAPPING_L1_FROM_L3;
            identifier = 'gmoId';
        }
    } else if (type === 'PO') {
        mappings = action.isAssignColorwayCode ? PO_FROM_PRODUCT_GRID_MAPPING_L1_FROM_L3 : PO_GRID_MAPPING_L1_FROM_L3;
        /**
         * Condition check to update parent MO grid from child PO grid update
         */
        if (state.gridData.modelOfferings !== undefined) {
            datas = (state.gridData.modelOfferings !== undefined) ? state.gridData.modelOfferings.slice() : [];
            mappings = MO_GRID_MAPPING_L1_FROM_L3;
            identifier = 'moId';
        }
    } else if (type === 'PO_FROM_PRODUCT') {
        mappings = PO_FROM_PRODUCT_L1_FROM_L3;
    } else if (type === 'CREATE_PO_FROM_MO') {
        datas = (state.gridData.modelOfferings !== undefined) ? state.gridData.modelOfferings.slice() : [];
        mappings = MO_GRID_MAPPING_L1_FROM_L3;
        identifier = 'moId';
    }
    if (action.data !== undefined && action.data.status === undefined) {
        if (datas.length > 0 && action.data.error === undefined) { /** edit object condition */
            let index = -1;
            let updatedGridRow = {};
            let elmData = {};
            if (type === 'CPO' && identifier === 'cmoId') {
                index = datas.map((d) => {return d[identifier]; }).indexOf(action.data.countryModelOffering.cmoId);
                updatedGridRow = datas[index];
                elmData = action.data.countryModelOffering;
            } else if (type === 'GPO' && identifier === 'gmoId') {
                index = datas.map((d) => {return d[identifier]; }).indexOf(action.data.geographyModelOffering.gmoId);
                updatedGridRow = datas[index];
                elmData = action.data.geographyModelOffering;
            } else if (type === 'PO' && identifier === 'moId') {
                index = datas.map((d) => {return d[identifier]; }).indexOf(action.data.modelOffering.moId);
                updatedGridRow = datas[index];
                elmData = action.data.modelOffering;
            } else if (type === 'CREATE_PO_FROM_MO' && identifier === 'moId') {
                index = datas.map((d) => {return d[identifier]; }).indexOf(action.data.moId);
                updatedGridRow = datas[index];
                elmData = action.data;
            } else {
                index = datas.map((d) => {return d[identifier]; }).indexOf(action.identifier);
                updatedGridRow = datas[index];
                elmData = action.data;
            }
            if (updatedGridRow !== undefined && action.data && action.data.affectedObjects === undefined) {
                for (const key in mappings) {
                    if (typeof mappings[key] === 'string') {
                        const elements = mappings[key].split('.');
                        if (elements.length > 0) {
                            let elementData = elmData;
                            elements.forEach((elm) => {
                                if (elementData[elm] !== undefined) {
                                    elementData = elementData[elm];
                                } else if (updatedGridRow[key] !== undefined && elementData[elm] === undefined) {
                                    elementData = '';
                                } else {
                                    elementData = (updatedGridRow[key] !== undefined) ? updatedGridRow[key] : '';
                                }
                            });
                            if (action.data.error === undefined || (action.data.error !== undefined && key === 'saveMessage')) {
                                updatedGridRow[key] = elementData;
                            }
                        } else {
                            if (action.data.error === undefined || (action.data.error !== undefined && key === 'saveMessage')) {
                                if (action.data[mappings[key]] !== undefined) {
                                    updatedGridRow[key] = action.data[mappings[key]];
                                } else {
                                    updatedGridRow[key] = (updatedGridRow[key] !== undefined) ? updatedGridRow[key] : '';
                                }
                            }
                        }
                    } else if (Array.isArray(mappings[key]) && _.result(action.data, mappings[key][0]) !== undefined) {
                        updatedGridRow[key] = [];
                        _.result(action.data, mappings[key][0]).forEach((element) => {
                            updatedGridRow[key].push(element[mappings[key][1]]);
                        });
                    }
                }
                if (action.data.error === undefined) {
                    updatedGridRow.saveStatus = 'SUCCESS';
                    updatedGridRow.errorCode = '';
                    updatedGridRow.saveMessage = '';
                } else {
                    updatedGridRow.saveStatus = 'FAILURE';
                    updatedGridRow.error = action.data.error;
                }
                let stateElement = state.defaultLinePlan.dataElementFromService;
                if (type === 'CPO' && identifier === 'cmoId') {
                    stateElement = 'countryModelOfferings';
                } else if (type === 'GPO' && identifier === 'gmoId') {
                    stateElement = 'geographyModelOfferings';
                } else if (type === 'PO' && identifier === 'moId') {
                    stateElement = 'modelOfferings';
                } else if (type === 'CREATE_PO_FROM_MO' && identifier === 'moId') {
                    stateElement = 'modelOfferings';
                }
                return Object.assign({}, state, { gridData: { ...state.gridData,
                    [stateElement]: state.gridData[stateElement].map((row, i) => {
                        if (index === i)  {
                            return Object.assign({}, updatedGridRow);
                        }
                        return row;
                    })
                }});
            }
        } else if (action.data.error !== undefined) {
            let index = -1;
            let storeElement = state.defaultLinePlan.dataElementFromService;
            let updatedGridRow = null;
            let duplicateObjectType = state.defaultLinePlan.shortenName;
            if (type === 'CPO' && identifier === 'cmoId') {
                storeElement = 'countryModelOfferings';
                duplicateObjectType = 'CMO';
            } else if (type === 'GPO' && identifier === 'gmoId') {
                storeElement = 'geographyModelOfferings';
                duplicateObjectType = 'GMO';
            } else if (type === 'PO' && identifier === 'moId') {
                storeElement = 'modelOfferings';
                duplicateObjectType = 'MO';
            }
            index = datas.map((d) => {return d[identifier]; }).indexOf(action.identifier);
            updatedGridRow = datas[index];
            if (updatedGridRow !== undefined && updatedGridRow !== null) {
                updatedGridRow.saveStatus = 'FAILURE';
                updatedGridRow.errorCode = action.data.error.code;
                updatedGridRow.error = action.data.error;
                updatedGridRow.saveMessage = (Math.floor(Math.random() * 1000) + 1) + action.data.error.message;
                if (['2110', '8010', '8009'].includes(action.data.error.code)) {
                    updatedGridRow.failedSampleSize = action.data.salesSampleSize.displayValue;
                } else if (['2139', '2140'].includes(action.data.error.code) && action.data.error.additionalInfo) {
                    updatedGridRow.failedRetailSizes = action.data.error.additionalInfo.split(',')
                        .filter(c => !!c)
                        .map(d => parseInt(d, 0));
                }
            }
            if ( action.data.error.duplicateObject !== undefined && action.data.error.duplicateObject !== null && index !== -1 && duplicateObjectType !== 'MODEL' && action.type !== 'SAVE_MO_EDITS_SUCCESS_UPDATE_GRID') { /** create object condition with duplicate objects */
                let duplicateObject = null;
                if (duplicateObjectType === 'MO') {
                    duplicateObject = duplicateObjectType + ': ' + action.data.error.duplicateObject.id + ' ' + action.data.error.duplicateObject.seasonName + ' ' + action.data.error.duplicateObject.marketingName;
                } else if (type === 'PO') {
                    duplicateObject = duplicateObjectType + ': ' + action.data.error.duplicateObject.id;
                } else {
                    duplicateObject = duplicateObjectType + ': ' + action.data.error.duplicateObject.id + ' ' + action.data.error.duplicateObject.seasonName + ' ' + action.data.error.duplicateObject.region;
                }
                updatedGridRow.duplicateObject = duplicateObject;
                return Object.assign({}, state, { gridData: { ...state.gridData,
                    [storeElement]: state.gridData[storeElement].map((row, i) => {
                        if (index === i)  {
                            return updatedGridRow;
                        }
                        return row;
                    })
                }});
            }
            return Object.assign({}, state, { gridData: { ...state.gridData,
                [storeElement]: state.gridData[storeElement].map((row, i) => {
                    if (index === i)  {
                        return updatedGridRow;
                    }
                    return row;
                })
            }});
        }
    } else {
        const index = datas.map((d) => {return d[identifier]; }).indexOf(action.identifier);
        const updatedGridRow = datas[index];
        if (updatedGridRow !== undefined) {
            updatedGridRow.saveStatus = 'FAILURE';
            updatedGridRow.saveMessage = (Math.floor(Math.random() * 1000) + 1) + (action.data.statusText !== undefined) ? action.data.statusText : 'Unknown Error:';
            updatedGridRow.errorCode = action.data.status;
        }
        let stateElement = state.defaultLinePlan.dataElementFromService;
        if (type === 'CPO' && identifier === 'cmoId') {
            stateElement = 'countryModelOfferings';
        } else if (type === 'GPO' && identifier === 'gmoId') {
            stateElement = 'geographyModelOfferings';
        } else if (type === 'PO' && identifier === 'moId') {
            stateElement = 'modelOfferings';
        }
        return Object.assign({}, state, { gridData: { ...state.gridData,
            [stateElement]: state.gridData[stateElement].map((row, i) => {
                if (index === i)  {
                    return updatedGridRow;
                }
                return row;
            })
        }});
    }
    return state;
}
function mapL3toL1(mappings, L3Data) {
    const L1Data = {};
    for (const key in mappings) {
        if (typeof mappings[key] === 'string') {
            const elements = mappings[key].split('.');
            L1Data[key] = null;
            if (elements.length > 0) {
                let elementData = L3Data;
                elements.forEach((elm) => {
                    if (elementData[elm] !== undefined) {
                        elementData = elementData[elm];
                    } else if (L1Data[key] !== undefined && elementData[elm] === undefined) {
                        elementData = '';
                    } else {
                        elementData = (L1Data[key] !== undefined) ? L1Data[key] : '';
                    }
                });
                L1Data[key] = elementData;
            }
        } else if (Array.isArray(mappings[key]) && L3Data[mappings[key][0]] !== undefined) {
            L1Data[key] = [];
            L3Data[mappings[key][0]].forEach((element) => {
                L1Data[key].push(element[mappings[key][1]]);
            });
        }
    }
    return L1Data;
}
/**
 * This function will handle the update process of trip prices in case of geo and cpo lineplans.
 * @param {object} state - handle the current reducer state data
 * @param {object} action - handle the action received with the datas to update trip prices in the grid
 */
function updateTripPricesInGrid(state, action) {
    let apiIterationCounter = state.apiIterationCounter;
    const len = state.gridData[state.defaultLinePlan.dataElementFromService].length;
    const gridDataObj = state.gridData;
    if (state.gridData[state.defaultLinePlan.dataElementFromService]) {
        if (apiIterationCounter === 0) {
            _DB.set('tripPrices_' + action.pane, []);
        }
        apiIterationCounter++;
        if (action.apiCount === apiIterationCounter) {
            let tripPrices = _DB.get('tripPrices_' + action.pane);
            tripPrices = tripPrices.concat(action.payload.data.tripPrices);
            for (let i  = 0; i < len; i++) {
                const obj = gridDataObj[state.defaultLinePlan.dataElementFromService][i];
                let tripPriceObj = {};
                if (action.linePlan === 'GEO') {
                    tripPriceObj = _.find(tripPrices, {id: obj.gmoId});
                } else {
                    tripPriceObj = _.find(tripPrices, {id: obj.cpoId});
                }
                if (tripPriceObj !== undefined) {
                    const calculatedTRIP = tripPriceObj.calculatedTRIP ? tripPriceObj.calculatedTRIP : '';
                    const currencyCd = tripPriceObj.currencyCd ? tripPriceObj.currencyCd : '';
                    obj.calculatedTRIP = calculatedTRIP;
                    obj.currencyCd = currencyCd;
                    gridDataObj[state.defaultLinePlan.dataElementFromService][i] = obj;
                }
            }
            _DB.remove('tripPrices_' + action.pane);
            return Object.assign({}, state, {gridData: {...state.gridData, [state.defaultLinePlan.dataElementFromService]: gridDataObj[state.defaultLinePlan.dataElementFromService]}, apiIterationCounter: apiIterationCounter});
        }
        let tripPrices = _DB.get('tripPrices_' + action.pane);
        tripPrices = tripPrices.concat(action.payload.data.tripPrices);
        _DB.set('tripPrices_' + action.pane, tripPrices);
        return Object.assign({}, state, {apiIterationCounter: apiIterationCounter});
    }
    return state;
}

/**
 * The function is used to update the griddata with devprojaliases obtained from the devprojalias API
 * @param {object} state - handle the current reducer state data
 * @param {object} action - handle the action received with the datas to update devprojalias in the grid
 */
function updatedevProjAliasesInGrid(state, action) {
    let apiIterationCounter = state.apiIterationCounter;
    const len = state.gridData[state.defaultLinePlan.dataElementFromService].length;
    const gridDataObj = state.gridData;
    if (state.gridData[state.defaultLinePlan.dataElementFromService]) {
        if (apiIterationCounter === 0) {
            _DB.set('devProjAliases_' + action.pane, []);
        }
        apiIterationCounter++;
        if (action.apiCount === apiIterationCounter) {
            let devProjAliases = _DB.get('devProjAliases_' + action.pane);
            devProjAliases = devProjAliases.concat(action.payload.data.moDevProjects);
            for (let i  = 0; i < len; i++) {
                const obj = gridDataObj[state.defaultLinePlan.dataElementFromService][i];
                const devProjAliasObj = _.find(devProjAliases, {moId: obj.moId});
                if (devProjAliasObj !== undefined) {
                    const devProject = devProjAliasObj.devProject ? devProjAliasObj.devProject : '';
                    obj.devProject = devProject;
                    gridDataObj[state.defaultLinePlan.dataElementFromService][i] = obj;
                }
            }
            _DB.remove('devProjAliases_' + action.pane);
            return Object.assign({}, state, { gridData: {...state.gridData, [state.defaultLinePlan.dataElementFromService]: gridDataObj[state.defaultLinePlan.dataElementFromService]}, apiIterationCounter: apiIterationCounter});
        }
        let devProjAliases = _DB.get('devProjAliases_' + action.pane);
        devProjAliases = devProjAliases.concat(action.payload.data.moDevProjects);
        _DB.set('devProjAliases_' + action.pane, devProjAliases);
        return Object.assign({}, state, {apiIterationCounter: apiIterationCounter});
    }
    return state;
}

function paneDetails(state = initialState, action) {
    switch (action.type) {
        case ACTIONS.INITIATE:
            return Object.assign({}, state, initialState);
        case ACTIONS.INCREMENT_SUCCESS:
            return Object.assign({}, state, {sampleData: action.payload});
        case ACTIONS.DECREMENT_SUCCESS:
            return Object.assign({}, state, {sampleData: action.payload});
        case ACTIONS.SET_LINE_PLAN:
            return Object.assign({}, state, {defaultLinePlan: action.payload, gridData: {}});
        case SEARCH_PANE_ACTIONS.LINE_PLAN_CHANGE:
            return Object.assign({}, state, {defaultLinePlan: action.payload, gridData: {}});
        case SEARCH_PANE_ACTIONS.DO_LINEPLAN_SEARCH:
            return Object.assign({}, state, {gridData: {[LINE_PLANS_CONFIG[action.linePlan].dataElementFromService]: []}, apiIterationCounter: 0});
        case SEARCH_PANE_ACTIONS.LINEPLAN_SEARCH_SUCCESS:
            return Object.assign({}, state, {gridData: action.payload.data, apiIterationCounter: 0});
        case SEARCH_PANE_ACTIONS.TRIPRETAILPRICE_SEARCH_SUCCESS:
            if (action.linePlan === 'GEO' || action.linePlan === 'CPO') {
                return updateTripPricesInGrid(state, action);
            }
            return state;
        case SEARCH_PANE_ACTIONS.DO_DEVPROJALIASES_SEARCH_SUCCESS:
            return updatedevProjAliasesInGrid(state, action);
        case ACTIONS.SAVE_DATA_FOR_CMO_SUCCESS_UPDATE_GRID:
        case ACTIONS.UPDATE_NEW_CMO_IN_GRID:
            return updateGrid(state, action, 'CMO');
        case PO_ACTIONS.SAVE_PO_EDITS_SUCCESS_UPDATE_GRID:
        case PO_ACTIONS.UPDATE_NEW_PO_IN_SUBGRID:
            return updateGrid(state, action, action.productEditFromPO ? 'PO_FROM_PRODUCT' : 'PO');
        case ACTIONS.SAVE_CPO_EDITS_SUCCESS_UPDATE_GRID:
        case ACTIONS.UPDATE_NEW_CPO_IN_GRID:
        case ACTIONS.UPDATE_NEW_CPO_IN_SUBGRID:
            return updateGrid(state, action, 'CPO');
        case ACTIONS.SAVE_GPO_EDITS_SUCCESS_UPDATE_GRID:
        case ACTIONS.UPDATE_NEW_GPO_IN_GRID:
        case ACTIONS.UPDATE_NEW_GPO_IN_SUBGRID:
            return updateGrid(state, action, 'GPO');
        case ACTIONS.SAVE_GMO_EDITS_SUCCESS_UPDATE_GRID:
        case ACTIONS.SAVE_GMOSTYLE_EDITS_SUCCESS_UPDATE_GRID:
        case ACTIONS.UPDATE_NEW_GMO_IN_GRID:
            return updateGrid(state, action, 'GMO');
        case MO_ACTIONS.UPDATE_NEW_MO_IN_MAINGRID:
        case MO_ACTIONS.SAVE_MO_EDITS_SUCCESS_UPDATE_GRID:
            return updateGrid(state, action, 'MO');
        case PO_ACTIONS.CREATE_NEW_PO_IN_SUBGRID:
            return updateGrid(state, action, 'CREATE_PO_FROM_MO');
        case ACTIONS.SAVE_MODEL_EDIT_SUCCESS_UPDATE_GRID:
            return updateGrid(state, action, 'MODEL');
        case ACTIONS.SAVE_PRODUCT_EDITS_SUCCESS_UPDATE_GRID:
            return updateGrid(state, action, action.productEditFromPO ? 'PO_FROM_PRODUCT' : 'PRODUCT');
        case STYLE_ACTIONS.UPDATE_STYLE_IN_GRID:
            const updatedData = updateGrid(state, action, 'STYLE');
            return Object.assign({}, state, {gridData: {...state.gridData, [state.defaultLinePlan.dataElementFromService]: updatedData.gridData[state.defaultLinePlan.dataElementFromService]}, });
        case ACTIONS.GET_CHANGE_HISTORY_SUCCESS:
            return Object.assign({}, state, {historyData: action.data});
        case ACTIONS.GET_REGION_CYCLES_SUCCESS:
            return Object.assign({}, state, {regionCycles: action.data});
        case ACTIONS.ADD_CMO_IN_GRID: {
            const data = action.data;
            const uniqueIds = (state.gridData !== undefined && state.gridData.countryModelOfferings !== undefined && state.gridData.countryModelOfferings.length > 0) ? state.gridData.countryModelOfferings.filter(d => d.uniqueId !== undefined).map(d => d.uniqueId) : [];
            const uniqueId = uniqueIds.length > 0 ? _.max(uniqueIds) + 1 : 0;
            data.uniqueId = uniqueId;
            return Object.assign({}, update(state, {
                gridData: {
                    countryModelOfferings: {$push: [data]}
                }
            }));
        }
        case ACTIONS.ADD_CPO_IN_GRID: {
            const data = action.data;
            const uniqueIds = (state.gridData !== undefined && state.gridData.countryProductOfferings !== undefined && state.gridData.countryProductOfferings.length > 0) ? state.gridData.countryProductOfferings.filter(d => d.uniqueId !== undefined).map(d => d.uniqueId) : [];
            const uniqueId = uniqueIds.length > 0 ? _.max(uniqueIds) + 1 : 0;
            data.uniqueId = uniqueId;
            return Object.assign({}, update(state, {
                gridData: {
                    countryProductOfferings: {$push: [data]}
                }
            }));
        }
        case ACTIONS.ADD_GMO_IN_GRID: {
            const data = action.data;
            const uniqueIds = (state.gridData !== undefined && state.gridData.geographyModelOfferings !== undefined && state.gridData.geographyModelOfferings.length > 0) ? state.gridData.geographyModelOfferings.filter(d => d.uniqueId !== undefined).map(d => d.uniqueId) : [];
            const uniqueId = uniqueIds.length > 0 ? _.max(uniqueIds) + 1 : 0;
            data.uniqueId = uniqueId;
            return Object.assign({}, update(state, {
                gridData: {
                    geographyModelOfferings: {$push: [data]}
                }
            }));
        }
        // Add New MO entry after Drag and Drop MO
        case MO_ACTIONS.ADD_MO_IN_MAINGRID: {
            const data = action.data;
            const uniqueIds = (state.gridData !== undefined && state.gridData.modelOfferings !== undefined && state.gridData.modelOfferings.length > 0) ? state.gridData.modelOfferings.filter(d => d.uniqueId !== undefined).map(d => d.uniqueId) : [];
            const uniqueId = uniqueIds.length > 0 ? _.max(uniqueIds) + 1 : 0;
            data.uniqueId = uniqueId;
            return Object.assign({}, update(state, {
                gridData: {
                    modelOfferings: {$push: [data]}
                }
            }));
        }
        // Add New MO entry after Drag and Drop MO
        case PO_ACTIONS.ADD_PO_IN_MAINGRID: {
            const data = action.data;
            const uniqueIds = (state.gridData !== undefined && state.gridData.productOfferings !== undefined && state.gridData.productOfferings.length > 0) ? state.gridData.productOfferings.filter(d => d.uniqueId !== undefined).map(d => d.uniqueId) : [];
            const uniqueId = uniqueIds.length > 0 ? _.max(uniqueIds) + 1 : 0;
            data.uniqueId = uniqueId;
            return Object.assign({}, update(state, {
                gridData: {
                    productOfferings: {$push: [data]}
                }
            }));
        }
        case ACTIONS.ADD_GPO_IN_GRID: {
            const data = action.data;
            const uniqueIds = (state.gridData !== undefined && state.gridData.geographyProductOfferings !== undefined && state.gridData.geographyProductOfferings.length > 0) ? state.gridData.geographyProductOfferings.filter(d => d.uniqueId !== undefined).map(d => d.uniqueId) : [];
            const uniqueId = uniqueIds.length > 0 ? _.max(uniqueIds) + 1 : 0;
            data.uniqueId = uniqueId;
            return Object.assign({}, update(state, {
                gridData: {
                    geographyProductOfferings: {$push: [data]}
                }
            }));
        }
        // Add New MO entry after Copy MO
        case MO_ACTIONS.ADD_NEW_MO_IN_MAINGRID:
            if (action.data !== undefined &&  action.data.error === undefined) {
                if (action.data) {
                    const mappings = MO_GRID_MAPPING_L1_FROM_L3;
                    const MO_L1 = {};
                    for (const key in mappings) {
                        if (typeof mappings[key] === 'string') {
                            const elements = mappings[key].split('.');
                            MO_L1[key] = null;
                            if (elements.length > 0) {
                                let elementData = action.data;
                                elements.forEach((elm) => {
                                    if (elementData[elm] !== undefined) {
                                        elementData = elementData[elm];
                                    } else if (MO_L1[key] !== undefined && elementData[elm] === undefined) {
                                        elementData = '';
                                    } else {
                                        elementData = (MO_L1[key] !== undefined) ? MO_L1[key] : '';
                                    }
                                });
                                MO_L1[key] = elementData;
                            }
                        } else if (Array.isArray(mappings[key]) && action.data[mappings[key][0]] !== undefined) {
                            MO_L1[key] = [];
                            action.data[mappings[key][0]].forEach((element) => {
                                MO_L1[key].push(element[mappings[key][1]]);
                            });
                        }
                    }
                    return Object.assign({}, update(state, {
                        gridData: {
                            modelOfferings: {$push: [MO_L1]}
                        }}));
                }
            }
            return state;
        case MO_ACTIONS.ADD_NEW_MOS_IN_MAINGRID:
            let stateToUpdate = Object.assign({}, state);
            if (action.data.length > 0) {
                action.data.forEach((data) => {
                    if (data && data.error === undefined) {
                        const mappings = MO_GRID_MAPPING_L1_FROM_L3;
                        const MO_L1 = {};
                        for (const key in mappings) {
                            if (typeof mappings[key] === 'string') {
                                const elements = mappings[key].split('.');
                                MO_L1[key] = null;
                                if (elements.length > 0) {
                                    let elementData = data;
                                    elements.forEach((elm) => {
                                        if (elementData[elm] !== undefined) {
                                            elementData = elementData[elm];
                                        } else if (MO_L1[key] !== undefined && elementData[elm] === undefined) {
                                            elementData = '';
                                        } else {
                                            elementData = (MO_L1[key] !== undefined) ? MO_L1[key] : '';
                                        }
                                    });
                                    MO_L1[key] = elementData;
                                }
                            } else if (Array.isArray(mappings[key]) && data[mappings[key][0]] !== undefined) {
                                MO_L1[key] = [];
                                data[mappings[key][0]].forEach((element) => {
                                    MO_L1[key].push(element[mappings[key][1]]);
                                });
                            }
                        }
                        stateToUpdate = Object.assign({}, update(stateToUpdate, {
                            gridData: {
                                modelOfferings: {$push: [MO_L1]}
                            }
                        }));
                    }
                });
            }
            return stateToUpdate;
        case ACTIONS.ADD_CREATED_MODEL_IN_GRID:
            const updateObj = state.gridData.models ? { $push: [action.data] } : { $set: [action.data] };
            return Object.assign({}, update(state, {
                gridData: {
                    models: !action.data.error ? updateObj : {$set: state.gridData.models},
                    objectForSave: {$set: action.data}
                }
            }));
        case PO_ACTIONS.ADD_CREATED_ASIAN_VERSION_IN_GRID:
            if (action.data !== undefined && action.data.error === undefined) {
                if (action.data) {
                    const mappings = PO_GRID_MAPPING_L1_FROM_L3;
                    const mappedPOs = action.data.productOfferings.map(po =>{
                        return mapL3toL1(mappings, po);
                    });
                    return Object.assign({}, update(state, {
                        gridData: {
                            productOfferings: { $push: mappedPOs }
                        }
                    }));
                }
            }
            return state;
        case ACTIONS.REMOVE_CMO_IN_MAIN_GRID:
            const cmoindex = state.gridData.countryModelOfferings.findIndex((d) => d[action.identifier] === action.value);
            if (cmoindex !== -1) {
                return Object.assign({}, update(state, {
                    gridData: {
                        countryModelOfferings: {$splice: [[cmoindex, 1]]}
                    }
                }));
            }
            return state;
        case ACTIONS.UPDATE_NO_CHANGE_IN_MAIN_GRID:
            const updatedNoChangeGridRowData = state.gridData[action.linePlan.dataElementFromService].find((d) => d[action.linePlan.identifier] === action.parentId);
            updatedNoChangeGridRowData.saveStatus = 'No Change Needed';
            updatedNoChangeGridRowData.errorCode = '';
            const index = state.gridData[action.linePlan.dataElementFromService].map((d) => {return d[action.linePlan.identifier]; }).indexOf(action.parentId);
            return Object.assign({}, state, { gridData: {
                [action.linePlan.dataElementFromService]: state.gridData[action.linePlan.dataElementFromService].map((row, i) => {
                    if (index === i)  {
                        return updatedNoChangeGridRowData;
                    }
                    return row;
                })
            }});
        case ACTIONS.UPDATE_ALT_PRICE_MSG_IN_MAIN_GRID:
            const updateAltPriceMsgRowData = state.gridData[action.linePlan.dataElementFromService].find((d) => d[action.linePlan.identifier] === action.parentId);
            updateAltPriceMsgRowData.errorCode = action.errorMsg;
            updateAltPriceMsgRowData.saveStatus = 'Validation Failed';
            const rowIndex = state.gridData[action.linePlan.dataElementFromService].map((d) => {return d[action.linePlan.identifier]; }).indexOf(action.parentId);
            return Object.assign({}, state, { gridData: {
                [action.linePlan.dataElementFromService]: state.gridData[action.linePlan.dataElementFromService].map((row, i) => {
                    if (rowIndex === i)  {
                        return updateAltPriceMsgRowData;
                    }
                    return row;
                })
            }});
        case ACTIONS.REMOVE_CPO_IN_MAIN_GRID:
            const cpoindex = state.gridData.countryProductOfferings.findIndex((d) => d[action.identifier] === action.value);
            if (cpoindex !== -1) {
                return Object.assign({}, update(state, {
                    gridData: {
                        countryProductOfferings: {$splice: [[cpoindex, 1]]}
                    }
                }));
            }
            return state;
        case ACTIONS.REMOVE_GMO_IN_MAIN_GRID:
            const gmoindex = state.gridData.geographyModelOfferings.findIndex((d) => d[action.identifier] === action.value);
            if (gmoindex !== -1) {
                return Object.assign({}, update(state, {
                    gridData: {
                        geographyModelOfferings: {$splice: [[gmoindex, 1]]}
                    }
                }));
            }
            return state;
        case MO_ACTIONS.REMOVE_MO_IN_MAIN_GRID:
            const moindex = state.gridData.modelOfferings.findIndex((d) => d[action.identifier] === action.value);
            if (moindex !== -1) {
                return Object.assign({}, update(state, {
                    gridData: {
                        modelOfferings: {$splice: [[moindex, 1]]}
                    }
                }));
            }
            return state;
        case PO_ACTIONS.REMOVE_PO_IN_GRID:
            const poindex = state.gridData.productOfferings.findIndex((d) => d[action.identifier] === action.value);
            if (poindex !== -1) {
                return Object.assign({}, update(state, {
                    gridData: {
                        productOfferings: {$splice: [[poindex, 1]]}
                    }
                }));
            }
            return state;
        case ACTIONS.REMOVE_GPO_IN_MAIN_GRID:
            const gpoindex = state.gridData.geographyProductOfferings.findIndex((d) => d[action.identifier] === action.value);
            if (gpoindex !== -1) {
                return Object.assign({}, update(state, {
                    gridData: {
                        geographyProductOfferings: {$splice: [[gpoindex, 1]]}
                    }
                }));
            }
            return state;
        case ACTIONS.UPDATE_CMO_ID_IN_CPO_GRID:
            const CPOdatas = state.gridData.countryProductOfferings.slice();
            const filteredRows = CPOdatas.filter((d) => d.cmoId === action.identifier);
            const cmoId = (action.data.error !== undefined && action.data.error.duplicateObject !== undefined && action.data.error.message.indexOf('Duplicate ID error') !== -1) ? action.data.error.duplicateObject.id : action.data.cmoId;
            filteredRows.forEach((FR) => {
                if (action.data.error && action.data.error.message.indexOf('Duplicate ID error') === -1) {
                    CPOdatas.find((d) => d.cpoId === FR.cpoId).error = action.data.error;
                    CPOdatas.find((d) => d.cpoId === FR.cpoId).errorCode = action.data.error.code;
                    CPOdatas.find((d) => d.cpoId === FR.cpoId).saveStatus = 'FAILURE';
                    CPOdatas.find((d) => d.cpoId === FR.cpoId).saveMessage = action.data.error.message;
                } else {
                    CPOdatas.find((d) => d.cpoId === FR.cpoId).cmoId = cmoId;
                }
            });
            return Object.assign({}, update(state, {
                gridData: {
                    countryProductOfferings: {$set: CPOdatas}
                }
            }));
        case MO_ACTIONS.UPDATE_MO_ID_IN_PO_GRID:
            const POdatasToUpdateMoId = state.gridData.productOfferings.slice();
            const filteredPORows = POdatasToUpdateMoId.filter((d) => d.moId === action.identifier);
            const moId = (action.data.error !== undefined && action.data.error.duplicateObject !== undefined && action.data.error.message.indexOf('Duplicate ID error') !== -1) ? action.data.error.duplicateObject.id : action.data.moId;
            filteredPORows.forEach((FR) => {
                if (action.data.error && action.data.error.message.indexOf('Duplicate ID error') === -1) {
                    POdatasToUpdateMoId.find((d) => d.productOfferingId === FR.productOfferingId).error = action.data.error;
                    POdatasToUpdateMoId.find((d) => d.productOfferingId === FR.productOfferingId).errorCode = action.data.error.code;
                    POdatasToUpdateMoId.find((d) => d.productOfferingId === FR.productOfferingId).saveStatus = 'FAILURE';
                    POdatasToUpdateMoId.find((d) => d.productOfferingId === FR.productOfferingId).saveMessage = action.data.error.message;
                } else {
                    POdatasToUpdateMoId.find((d) => d.productOfferingId === FR.productOfferingId).moId = moId;
                }
            });
            return Object.assign({}, update(state, {
                gridData: {
                    productOfferings: {$set: POdatasToUpdateMoId}
                }
            }));
        case ACTIONS.UPDATE_GMO_ID_IN_GPO_GRID:
            const GPOdatas = state.gridData.geographyProductOfferings.slice();
            const filteredGPORows = GPOdatas.filter((d) => d.gmoId === action.identifier);
            const gmoId = (action.data.error !== undefined && action.data.error.duplicateObject !== undefined && action.data.error.message.indexOf('Duplicate ID error') !== -1) ? action.data.error.duplicateObject.id : action.data.gmoId;
            filteredGPORows.forEach((FR) => {
                if (action.data.error && action.data.error.message.indexOf('Duplicate ID error') === -1) {
                    GPOdatas.find((d) => d.gpoId === FR.gpoId).error = action.data.error;
                    GPOdatas.find((d) => d.gpoId === FR.gpoId).errorCode = action.data.error.code;
                    GPOdatas.find((d) => d.gpoId === FR.gpoId).saveStatus = 'FAILURE';
                    GPOdatas.find((d) => d.gpoId === FR.gpoId).saveMessage = action.data.error.message;
                } else {
                    GPOdatas.find((d) => d.gpoId === FR.gpoId).gmoId = gmoId;
                }
            });
            return Object.assign({}, update(state, {
                gridData: {
                    geographyProductOfferings: {$set: GPOdatas}
                }
            }));
        case ACTIONS.UPDATE_INACTIVE_PARENT_ERROR_EMPTY: {
            let rowDatas = state.gridData[(action.elementType === 'CMO') ? 'countryProductOfferings' : 'geographyProductOfferings'].slice();
            rowDatas = rowDatas.map((d) => {
                const identifier = (action.elementType === 'CMO') ? 'cmoId' : 'gmoId';
                if (d[identifier] === action.identifier) {
                    d.error = null;
                    d.errorCode = null;
                    d.saveStatus = '';
                    d.saveMessage = null;
                    return d;
                }
                return d;
            });
            return Object.assign({}, update(state, {
                gridData: {
                    [(action.elementType === 'CMO') ? 'countryProductOfferings' : 'geographyProductOfferings']: {$set: rowDatas}
                }
            }));
        }
        case ACTIONS.RESET_ERROR_IN_MAIN_GRID: {
            const indexToUpdate = state.gridData[action.linePlan.dataElementFromService].findIndex((d) => d[action.linePlan.identifier] === action.identifier);
            const updatedElement = Object.assign({}, state.gridData[action.linePlan.dataElementFromService][indexToUpdate]);
            updatedElement.error = null;
            updatedElement.errorCode = null;
            updatedElement.saveStatus = '';
            updatedElement.saveMessage = null;
            if (gpoindex !== -1) {
                return Object.assign({}, update(state, {
                    gridData: {
                        [action.linePlan.dataElementFromService]: {$splice: [[indexToUpdate, 1, updatedElement]]}
                    }
                }));
            }
            return state;
        }
        case PO_ACTIONS.UPDATE_IMAGE_PUBLISH_STATUS_IN_MAIN_GRID:
            const POdatas = state.gridData.productOfferings.slice();
            action.changePoId.forEach((poToRemove) => {
                const sourcePOindex = POdatas.map(data => data.productId).indexOf(poToRemove);
                POdatas[sourcePOindex].imagePublishStatus = action.publishStatus;
            });
            return Object.assign({}, update(state, {
                gridData: {
                    productOfferings: {$set: POdatas}
                }
            }));
        case PO_ACTIONS.UPDATE_MOVE_PO_STATUS:
            const sourcePoS = state.gridData.productOfferings.slice();
            action.targetPos.forEach(targetPo => {
                const sourcePOindex = sourcePoS.map(data => data.productOfferingId).indexOf(targetPo.productOfferingId);
                sourcePoS[sourcePOindex].active = targetPo.active;
                sourcePoS[sourcePOindex].productCOStatus = targetPo.productCOStatus;
            });
            return Object.assign({}, update(state, {
                gridData: {
                    productOfferings: {$set: sourcePoS}
                }
            }));
        default:
            return state;
    }
}


export default combineReducers({
    paneDetails,
    gridPaneDetails
});
