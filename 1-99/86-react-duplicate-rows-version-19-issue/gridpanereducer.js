import { ACTIONS } from '../constants/paneConstants';
import { ACTIONS as SEARCH_PANE_ACTIONS } from '../constants/searchPaneConstants';
import { ACTIONS as APPROVE_COLORS_ACTIONS } from '../constants/approveColorsConstants';
import CPO_GRID_MAPPING_L1_FROM_L3 from '../constants/L1FromL3Mappings/CPO';
import GPO_GRID_MAPPING_L1_FROM_L3 from '../constants/L1FromL3Mappings/GPO';
import PO_GRID_MAPPING_L1_FROM_L3 from '../constants/L1FromL3Mappings/PO';
import { LINE_PLANS_CONFIG } from '../constants/appConstants';
import APPROVE_COLORS_FUNCTIONS from './approveColors/approveColorsFunctions';
import MO_GRID_MAPPING_L1_FROM_L3 from '../constants/L1FromL3Mappings/MO';
import PRODUCT_GRID_MAPPING_L1_FROM_L3 from '../constants/L1FromL3Mappings/PRODUCT';
import PO_GRID_MAPPING_L1_FROM_L3_FOR_CREATE_PO from '../constants/L1FromL3Mappings/PO_FOR_CREATE';
import PO_FROM_PRODUCT_GRID_MAPPING_L1_FROM_L3 from '../constants/L1FromL3Mappings/PO_FROM_PRODUCT';

import update from 'immutability-helper';
import _ from 'lodash';
import DB from  '../services/DBService';
import { MO_ACTIONS } from '../constants/MOConstants';
import { PO_ACTIONS } from '../constants/POConstants';
/* eslint no-unused-vars:0 */
/* eslint no-loop-func: 0 */

const _DB = DB.getInstance();
const initialState = {
    tabDetails: {},
    objectCreateEdit: {}
};

function updateGrid(state, action, type, tabIdentifier) {
    let datas = [];
    let mappings = {};
    let identifier = (type !== 'MO' && type !== 'Product') ? LINE_PLANS_CONFIG[type].identifier : '';
    let index = 0;
    let updatedGridRow = {};
    let dataElement = (type !== 'MO' && type !== 'Product') ? LINE_PLANS_CONFIG[type].dataElementFromService : '';
    if (type === 'MO') {
        identifier = LINE_PLANS_CONFIG.GLOBAL.identifier;
        dataElement = LINE_PLANS_CONFIG.GLOBAL.dataElementFromService;
    }
    if(type === 'Product') {
        identifier = LINE_PLANS_CONFIG.PRODUCT.identifier;
        dataElement = LINE_PLANS_CONFIG.PRODUCT.dataElementFromService;
    }
    if (type === 'CPO') {
        datas = (state.tabDetails[tabIdentifier] !== undefined) ? state.tabDetails[tabIdentifier][type][dataElement].slice() : [];
        mappings = CPO_GRID_MAPPING_L1_FROM_L3;
        index = datas.map((d) => {return d[identifier]; }).indexOf(action.identifier);
        updatedGridRow = datas[index];
    } else if (type === 'GPO') {
        datas = (state.tabDetails[tabIdentifier] !== undefined) ? state.tabDetails[tabIdentifier][type][dataElement].slice() : [];
        mappings = GPO_GRID_MAPPING_L1_FROM_L3;
        index = datas.map((d) => {return d[identifier]; }).indexOf(action.identifier);
        updatedGridRow = datas[index];
    } else if (type === 'PO') {
        datas = (state.tabDetails[tabIdentifier] !== undefined && state.tabDetails[tabIdentifier][type] !== undefined && state.tabDetails[tabIdentifier][type][dataElement] !== undefined && state.tabDetails[tabIdentifier][type][dataElement].length > 0) ? state.tabDetails[tabIdentifier][type][dataElement].slice() : [];
        mappings = action.isAssignColorwayCode ? PO_FROM_PRODUCT_GRID_MAPPING_L1_FROM_L3 : PO_GRID_MAPPING_L1_FROM_L3;
        identifier = action.isAssignColorwayCode ?  LINE_PLANS_CONFIG.PRODUCT.identifier : identifier;
        index = datas.map((d) => {return d[identifier]; }).indexOf(action.identifier);
        updatedGridRow = datas[index];
    } else if (type === 'MO') {
        datas = (state.tabDetails[tabIdentifier] !== undefined) ? state.tabDetails[tabIdentifier][type][dataElement].slice() : [];
        mappings = MO_GRID_MAPPING_L1_FROM_L3;
        index = datas.map((d) => {return d[identifier]; }).indexOf(action.identifier);
        updatedGridRow = datas[index];
    } else if (type === 'Product') {
        datas = (state.tabDetails[tabIdentifier] !== undefined && state.tabDetails[tabIdentifier][type] !== undefined && state.tabDetails[tabIdentifier][type][dataElement] !== undefined && state.tabDetails[tabIdentifier][type][dataElement].length > 0) ? state.tabDetails[tabIdentifier][type][dataElement].slice() : [];
        mappings = PRODUCT_GRID_MAPPING_L1_FROM_L3;
        index = datas.map((d) => {return d[identifier]; }).indexOf(action.identifier);
        updatedGridRow = datas[index];
    }
    if (datas.length > 0 && action.data !== undefined && action.data.error === undefined && action.data.affectedObjects === undefined) {
        for (const key in mappings) {
            if (typeof mappings[key] === 'string') {
                const elements = mappings[key].split('.');
                if (elements.length > 0) {
                    let elementData = action.data;
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
            } else if (Array.isArray(mappings[key]) && action.data[mappings[key][0]] !== undefined) {
                updatedGridRow[key] = [];
                action.data[mappings[key][0]].forEach((element) => {
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
        }
    }
    if (action.data.status === undefined) {
        if (action.data.error === undefined) {
            return Object.assign({}, state, {
                objectCreateEdit: (state.objectCreateEdit[action.identifier] !== undefined) ? {
                    ...state.objectCreateEdit,
                    [action.identifier]: {
                        ...state.objectCreateEdit[action.identifier],
                        data: action.data
                    }
                } : {...state.objectCreateEdit},
                tabDetails: (datas.length > 0 && state.tabDetails[tabIdentifier] !== undefined) ? {
                    ...state.tabDetails,
                    [tabIdentifier]: {
                        ...state.tabDetails[tabIdentifier],
                        [type]: {
                            ...state.tabDetails[tabIdentifier][type],
                            // countryProductOfferings: [...state.tabDetails[tabIdentifier][type].countryProductOfferings, {[index]: updatedGridRow}]
                            [dataElement]: state.tabDetails[tabIdentifier][type][dataElement].map((row, i) => {
                                if (index === i)  {
                                    return Object.assign({}, updatedGridRow);
                                }
                                return row;
                            })
                        }
                    }
                } : {...state.tabDetails}
            });
        } else if (action.data.error !== undefined) {
            if (updatedGridRow !== undefined && updatedGridRow !== null) {
                updatedGridRow.saveStatus = 'FAILURE';
                updatedGridRow.errorCode = action.data.error.code;
                updatedGridRow.error = action.data.error;
                updatedGridRow.saveMessage = (Math.floor(Math.random() * 1000) + 1) + action.data.error.message;
            }
            if (state.tabDetails[tabIdentifier] !== undefined && action.data.error.duplicateObject !== undefined && action.data.error.duplicateObject !== null) {
                const indexToUpdate = state.tabDetails[tabIdentifier][type][dataElement].map((d) => {return d[identifier]; }).indexOf(action.identifier);
                // const cpoindex = state.tabDetails[tabIdentifier][type][dataElement].findIndex((row) => row[identifier] === action.identifier);
                let duplicateObject = null;
                if (type === 'PO') {
                    duplicateObject = type + ': ' + action.data.error.duplicateObject.id;
                } else {
                    duplicateObject = type + ': ' + action.data.error.duplicateObject.id + ' ' + action.data.error.duplicateObject.seasonName + ' ' + action.data.error.duplicateObject.region;
                }
                updatedGridRow.duplicateObject = duplicateObject;
                if (indexToUpdate !== -1) {
                    const updateState = Object.assign({}, state, {
                        objectCreateEdit: (state.objectCreateEdit[action.identifier] !== undefined) ? {
                            ...state.objectCreateEdit,
                            [action.identifier]: {
                                ...state.objectCreateEdit[action.identifier],
                                data: action.data
                            }
                        } : {...state.objectCreateEdit},
                        tabDetails: (datas.length > 0 && state.tabDetails[tabIdentifier] !== undefined) ? {
                            ...state.tabDetails,
                            [tabIdentifier]: {
                                ...state.tabDetails[tabIdentifier],
                                [type]: {
                                    ...state.tabDetails[tabIdentifier][type],
                                    [dataElement]: state.tabDetails[tabIdentifier][type][dataElement].map((row, i) => {
                                        if (index === i)  {
                                            return updatedGridRow;
                                        }
                                        return row;
                                    })
                                }
                            }
                        } : {...state.tabDetails}
                    });

                    if (action.type !== 'UPDATE_MO_IN_SUBGRID') {
                        /* return Object.assign(updateState, update(updateState, {
                            tabDetails: {
                                ...updateState.tabDetails,
                                [tabIdentifier]: {
                                    [type]: {
                                        [dataElement]: {$splice: [[indexToUpdate, 1]]}
                                    }
                                }
                            }
                        })); */
                        return updateState;
                    }
                    return updateState;
                }
            } else {
                if (updatedGridRow) {
                    if (['2110', '8010', '8009'].includes(action.data.error.code)) {
                        updatedGridRow.failedSampleSize = action.data.salesSampleSize.displayValue;
                    } else if (['2139', '2140'].includes(action.data.error.code) && action.data.error.additionalInfo) {
                        updatedGridRow.failedRetailSizes = action.data.error.additionalInfo.split(',')
                            .filter(c => !!c)
                            .map(d => parseInt(d, 0));
                    }
                }
                return Object.assign({}, state, {
                    objectCreateEdit: (state.objectCreateEdit[action.identifier] !== undefined) ? {
                        ...state.objectCreateEdit,
                        [action.identifier]: {
                            ...state.objectCreateEdit[action.identifier],
                            data: action.data
                        }
                    } : {...state.objectCreateEdit},
                    tabDetails: (datas.length > 0 && state.tabDetails[tabIdentifier] !== undefined) ? {
                        ...state.tabDetails,
                        [tabIdentifier]: {
                            ...state.tabDetails[tabIdentifier],
                            [type]: {
                                ...state.tabDetails[tabIdentifier][type],
                                [dataElement]: state.tabDetails[tabIdentifier][type][dataElement].map((row, i) => {
                                    if (index === i)  {
                                        return updatedGridRow;
                                    }
                                    return row;
                                })
                            }
                        }
                    } : {...state.tabDetails}
                });
            }
        }
    } else {
        if (updatedGridRow !== undefined) {
            updatedGridRow.saveStatus = 'FAILURE';
            updatedGridRow.saveMessage = (Math.floor(Math.random() * 1000) + 1) + (action.data.statusText !== undefined) ? action.data.statusText : 'Unknown Error:';
            updatedGridRow.errorCode = action.data.status;
        }
        return Object.assign({}, state, {
            objectCreateEdit: (state.objectCreateEdit[action.identifier] !== undefined) ? {
                ...state.objectCreateEdit,
                [action.identifier]: {
                    ...state.objectCreateEdit[action.identifier],
                    data: action.data
                }
            } : {...state.objectCreateEdit},
            tabDetails: (datas.length > 0 && state.tabDetails[tabIdentifier] !== undefined) ? {
                ...state.tabDetails,
                [tabIdentifier]: {
                    ...state.tabDetails[tabIdentifier],
                    [type]: {
                        ...state.tabDetails[tabIdentifier][type],
                        [dataElement]: state.tabDetails[tabIdentifier][type][dataElement].map((row, i) => {
                            if (index === i)  {
                                return updatedGridRow;
                            }
                            return row;
                        })
                    }
                }
            } : {...state.tabDetails}
        });
    }
    return state;
}

function updateTripPricesInGrid(state, action) {
    const gmos = state.tabDetails[action.identifier];
    if (gmos && gmos.CPO && gmos.CPO.countryProductOfferings) {
        for (let i  = 0; i < gmos.CPO.countryProductOfferings.length; i++) {
            const cpoObj = gmos.CPO.countryProductOfferings[i];
            const tripPriceObj = _.find(action.payload.data.tripPrices, {id: cpoObj.cpoId});
            if (tripPriceObj !== undefined) {
                const calculatedTRIP = tripPriceObj.calculatedTRIP ? tripPriceObj.calculatedTRIP : '';
                const currencyCd = tripPriceObj.currencyCd ? tripPriceObj.currencyCd : '';
                cpoObj.calculatedTRIP = calculatedTRIP;
                cpoObj.currencyCd = currencyCd;
                gmos.CPO.countryProductOfferings[i] = cpoObj;
            }
        }
        return Object.assign({}, update(state, {
            tabDetails: {
                [action.identifier]: {
                    CPO: {countryProductOfferings: {$set: gmos.CPO.countryProductOfferings}}
                }
            }
        }));
    }
    return state;
}

function updateSubGridFromMainGrid(state, action, gridType) {
    if (action.data.error === undefined) {
        let rows = [];
        const dataElement = LINE_PLANS_CONFIG[gridType].dataElementFromService;
        if (state.tabDetails[action.identifier] !== undefined && state.tabDetails[action.identifier][gridType] !== undefined && state.tabDetails[action.identifier][gridType][dataElement] !== undefined) {
            rows = (state.tabDetails[action.identifier] !== undefined) ? state.tabDetails[action.identifier][gridType][dataElement].slice() : [];
            if (rows.length > 0) {
                rows.forEach((row) => {
                    if (action.data.retailPrice !== undefined || row.retailPrice !== undefined) {
                        row.retailPrice = (action.data.retailPrice !== undefined) ? action.data.retailPrice : row.retailPrice;
                    }
                    if (action.data.wholesalePrice !== undefined || row.wholesalePrice !== undefined) {
                        row.wholesalePrice = (action.data.wholesalePrice !== undefined) ? action.data.wholesalePrice : row.wholesalePrice;
                    }
                    if (!action.data.active && action.data && action.data.affectedObjects === undefined) {
                        row.active = (action.data.active !== undefined) ? action.data.active : row.active;
                    }
                });
            }
        }
        return Object.assign({}, state, {
            objectCreateEdit: (state.objectCreateEdit[action.identifier] !== undefined) ? {
                ...state.objectCreateEdit,
                [action.identifier]: {
                    ...state.objectCreateEdit[action.identifier],
                    data: action.data
                }
            } : {...state.objectCreateEdit},
            tabDetails: (rows.length > 0 && state.tabDetails[action.identifier] !== undefined) ? {
                ...state.tabDetails,
                [action.identifier]: {
                    ...state.tabDetails[action.identifier],
                    [gridType]: {
                        ...state.tabDetails[action.identifier][gridType],
                        [dataElement]: rows
                    }
                }
            } : {...state.tabDetails}
        });
    } else if (action.data.error !== undefined) {
        return Object.assign({}, state, {objectCreateEdit: {...state.objectCreateEdit, [action.identifier]: {...state.objectCreateEdit[action.identifier], data: action.data}}});
    }
    return state;
}


function GridPaneReducer(state = initialState, action) {
    switch (action.type) {
        case ACTIONS.FETCH_GRID_TAB_DATAS_SUCCESS:
            if (state.tabDetails[action.identifier][action.tabName] !== undefined && action.tabName === 'CPO') {
                return Object.assign({}, update(state, {
                    tabDetails: {
                        [action.identifier]: {
                            [action.tabName]: {countryProductOfferings: {$push: action.tabDatas.countryProductOfferings}}
                        }
                    }
                }));
            }
            if (state.tabDetails[action.identifier][action.tabName] !== undefined && action.tabName === 'GPO') {
                return Object.assign({}, update(state, {
                    tabDetails: {
                        [action.identifier]: {
                            [action.tabName]: {geographyProductOfferings: {$push: action.tabDatas.geographyProductOfferings}}
                        }
                    }
                }));
            }
            if (state.tabDetails[action.identifier][action.tabName] !== undefined && action.tabName === 'PO') {
                return Object.assign({}, update(state, {
                    tabDetails: {
                        [action.identifier]: {
                            [action.tabName]: {productOfferings: {$push: action.tabDatas.productOfferings}}
                        }
                    }
                }));
            }
            return Object.assign({}, state, {tabDetails: {...state.tabDetails, [action.identifier]: {...state.tabDetails[action.identifier], [action.tabName]: action.tabDatas}}});
        case APPROVE_COLORS_ACTIONS.FETCH_UNLINKED_IMAGES_SUCCESS:
            return APPROVE_COLORS_FUNCTIONS.fetchUnlinkImages(state, action);
        case APPROVE_COLORS_ACTIONS.FETCH_HIDDEN_IMAGES_SUCCESS:
            return APPROVE_COLORS_FUNCTIONS.fetchHiddenImages(state, action);
        case APPROVE_COLORS_ACTIONS.HIDE_UNHIDE_IMAGES_SUCCESS:
            return APPROVE_COLORS_FUNCTIONS.hideUnhideImages(state, action);
        case APPROVE_COLORS_ACTIONS.GET_BOM_COLOR_DESCRIPTION_SUCCESS:
            return APPROVE_COLORS_FUNCTIONS.getBOMColorDesc(state, action);
        case APPROVE_COLORS_ACTIONS.MOVE_IMAGE_TO_UNLINK:
            return APPROVE_COLORS_FUNCTIONS.moveImageToUnlink(state, action);
        case APPROVE_COLORS_ACTIONS.REMOVE_IMAGE_FROM_OTHERMOIMAGES:
            return APPROVE_COLORS_FUNCTIONS.removeImageFromOtherMO(state, action);
        case APPROVE_COLORS_ACTIONS.GET_UPDATED_COLORWAY_SUCCESS:
            return APPROVE_COLORS_FUNCTIONS.updateColorway(state, action);
        case APPROVE_COLORS_ACTIONS.MOVE_IMAGE_FROM_UNLINK_IMAGES:
            return APPROVE_COLORS_FUNCTIONS.moveImageFromUnlink(state, action);
        case APPROVE_COLORS_ACTIONS.MOVE_IMAGE_BTW_PRODUCTS:
            return APPROVE_COLORS_FUNCTIONS.moveImageBtwProducts(state, action);
        case APPROVE_COLORS_ACTIONS.UPDATE_PRODUCT:
            return APPROVE_COLORS_FUNCTIONS.updateProduct(state, action);
        case SEARCH_PANE_ACTIONS.TRIPRETAILPRICE_SEARCH_SUCCESS:
            if(action.linePlan === 'COUNTRY') {
                return updateTripPricesInGrid(state, action);
            }
            return state;
        case ACTIONS.ADD_CPO_IN_SUBGRID: {
            const data = action.newData;
            const uniqueIds = (state.tabDetails !== undefined && state.tabDetails[action.identifier] !== undefined && state.tabDetails[action.identifier][action.tabName] !== undefined && state.tabDetails[action.identifier][action.tabName].countryProductOfferings !== undefined && state.tabDetails[action.identifier][action.tabName].countryProductOfferings.length > 0) ? state.tabDetails[action.identifier][action.tabName].countryProductOfferings.map(d => d.uniqueId) : [];
            const uniqueId = uniqueIds.length > 0 ? _.max(uniqueIds) + 1 : 0;
            data.uniqueId = uniqueId;
            if (state.tabDetails[action.identifier][action.tabName] !== undefined) {
                return Object.assign({}, update(state, {
                    tabDetails: {
                        [action.identifier]: {
                            [action.tabName]: {countryProductOfferings: {$push: [data]}}
                        }
                    }
                }));
            }
            return Object.assign({}, state, {tabDetails: {...state.tabDetails, [action.identifier]: {...state.tabDetails[action.identifier], [action.tabName]: {...state.tabDetails[action.identifier][action.tabName], countryProductOfferings: [data]}}}});
        }
        case ACTIONS.ADD_GPO_IN_SUBGRID: {
            const data = action.newData;
            const uniqueIds = (state.tabDetails !== undefined && state.tabDetails[action.identifier] !== undefined && state.tabDetails[action.identifier][action.tabName] !== undefined && state.tabDetails[action.identifier][action.tabName].geographyProductOfferings !== undefined && state.tabDetails[action.identifier][action.tabName].geographyProductOfferings.length > 0) ? state.tabDetails[action.identifier][action.tabName].geographyProductOfferings.map(d => d.uniqueId) : [];
            const uniqueId = uniqueIds.length > 0 ? _.max(uniqueIds) + 1 : 0;
            data.uniqueId = uniqueId;
            if (state.tabDetails[action.identifier][action.tabName] !== undefined) {
                return Object.assign({}, update(state, {
                    tabDetails: {
                        [action.identifier]: {
                            [action.tabName]: {geographyProductOfferings: {$push: [data]}}
                        }
                    }
                }));
            }
            return Object.assign({}, state, {tabDetails: {...state.tabDetails, [action.identifier]: {...state.tabDetails[action.identifier], [action.tabName]: {...state.tabDetails[action.identifier][action.tabName], geographyProductOfferings: [data]}}}});
        }
        case PO_ACTIONS.ADD_PO_IN_SUBGRID: {
            const data = action.newData;
            const uniqueIds = (state.tabDetails !== undefined && state.tabDetails[action.identifier] !== undefined && state.tabDetails[action.identifier][action.tabName] !== undefined && state.tabDetails[action.identifier][action.tabName].productOfferings !== undefined && state.tabDetails[action.identifier][action.tabName].productOfferings.length > 0) ? state.tabDetails[action.identifier][action.tabName].productOfferings.map(d => d.uniqueId) : [];
            const uniqueId = uniqueIds.length > 0 ? _.max(uniqueIds) + 1 : 0;
            data.uniqueId = uniqueId;
            if (state.tabDetails[action.identifier][action.tabName] !== undefined) {
                return Object.assign({}, update(state, {
                    tabDetails: {
                        [action.identifier]: {
                            [action.tabName]: {productOfferings: {$push: [data]}}
                        }
                    }
                }));
            }
            return Object.assign({}, state, {tabDetails: {...state.tabDetails, [action.identifier]: {...state.tabDetails[action.identifier], [action.tabName]: {...state.tabDetails[action.identifier][action.tabName], productOfferings: [data]}}}});
        }
        case PO_ACTIONS.CREATE_NEW_PO_IN_SUBGRID:
            let updatedState = Object.assign({}, state);
            if(state.tabDetails && state.tabDetails[action.identifier] !== undefined) {
                const newPOs = [];
                const newProducts = [];
                const responseData = Object.assign({}, action.data);
                if (action.data.productOfferings.length > 0) {
                    action.data.productOfferings.forEach((PO_L3) => {
                        const mappingsArray = [];
                        PO_L3.regionCycle = action.data.regionCycle;
                        if (state.tabDetails[action.identifier].PO) {
                            mappingsArray.push({key: 'PO', val: PO_GRID_MAPPING_L1_FROM_L3_FOR_CREATE_PO});
                        }
                        if (state.tabDetails[action.identifier].Product && PO_L3.product) {
                            mappingsArray.push({key: 'Product', val: PRODUCT_GRID_MAPPING_L1_FROM_L3});
                        }
                        mappingsArray.map((mappings) =>  {
                            const PO_L1 = {};
                            PO_L1.moId = action.identifier;
                            for (const key in mappings.val) {
                                if (!mappings.val.hasOwnProperty(key)) continue;
                                let elementToUpdate = mappings.val[key];
                                let elementData = (mappings.key === 'Product') ? PO_L3.product : PO_L3;
                                if (typeof mappings.val[key] === 'object' && !Array.isArray(mappings.val[key]) && mappings.val[key].fromRootObject !== undefined) {
                                    elementToUpdate = mappings.val[key].fromRootObject;
                                    elementData = responseData;
                                }
                                if (typeof elementToUpdate === 'string') {
                                    const elements = elementToUpdate.split('.');
                                    PO_L1[key] = null;
                                    if (elements.length > 0) {
                                        elements.forEach((elm) => {
                                            if (elementData[elm] !== undefined) {
                                                elementData = elementData[elm];
                                            } else if (PO_L1[key] !== undefined && elementData[elm] === undefined) {
                                                elementData = '';
                                            } else {
                                                elementData = (PO_L1[key] !== undefined) ? PO_L1[key] : '';
                                            }
                                        });
                                        PO_L1[key] = elementData;
                                    }
                                } else if (Array.isArray(elementToUpdate) && _.result(elementData, elementToUpdate[0]) !== undefined) {
                                    PO_L1[key] = [];
                                    _.result(elementData, elementToUpdate[0]).forEach((element) => {
                                        PO_L1[key].push(element[elementToUpdate[1]]);
                                    });
                                }
                            }
                            if (mappings.key === 'PO') {
                                newPOs.push(PO_L1);
                            } else {
                                newProducts.push(PO_L1);
                            }
                        });
                    });
                }
                if(newPOs.length > 0 && newProducts.length > 0) {
                    updatedState = Object.assign({}, update(updatedState, {
                        tabDetails: {
                            [action.identifier]: {
                                PO: {productOfferings: {$push: newPOs}},
                                Product: {products: {$push: newProducts}}
                            }
                        }
                    }));
                }else if(newPOs.length > 0) {
                    updatedState =  Object.assign({}, update(updatedState, {
                        tabDetails: {
                            [action.identifier]: {
                                PO: {productOfferings: {$push: newPOs}}
                            }
                        }
                    }));
                }else if(newProducts.length > 0) {
                    updatedState = Object.assign({}, update(updatedState, {
                        tabDetails: {
                            [action.identifier]: {
                                Product: {products: {$push: newProducts}}
                            }
                        }
                    }));
                }
            }
            return updatedState;
        case ACTIONS.UPDATE_NO_CHANGE_IN_SUB_GRID:
            const { parentId, linePlan } = action;
            const { dataElementFromService, identifier, shortenName } = linePlan;
            const linePlanName = shortenName === 'PRODUCT' ? 'Product' : shortenName;

            const updatedNoChangeGridRowData = state.tabDetails[parentId][linePlanName][dataElementFromService].find((d) => d[identifier] === action.childId);
            updatedNoChangeGridRowData.saveStatus = 'No Change Needed';
            updatedNoChangeGridRowData.errorCode = '';
            const index = state.tabDetails[parentId][linePlanName][dataElementFromService].map((d) => {return d[identifier]; }).indexOf(action.childId);
            return Object.assign({}, state, {
                tabDetails: (state.tabDetails[parentId][linePlanName][dataElementFromService].length > 0 && state.tabDetails[action.parentId] !== undefined) ? {
                    ...state.tabDetails,
                    [parentId]: {
                        ...state.tabDetails[parentId],
                        [linePlanName]: {
                            ...state.tabDetails[parentId][linePlanName],
                            [dataElementFromService]: state.tabDetails[parentId][linePlanName][dataElementFromService].map((row, i) => {
                                if (index === i)  {
                                    return updatedNoChangeGridRowData;
                                }
                                return row;
                            })
                        }
                    }
                } : {...state.tabDetails}
            });
        case ACTIONS.UPDATE_ALT_PRICE_MSG_IN_SUB_GRID:
            const updatedAltPriceSubGridRowData = state.tabDetails[action.parentId][action.linePlan.shortenName][action.linePlan.dataElementFromService].find((d) => d[action.linePlan.identifier] === action.childId);
            updatedAltPriceSubGridRowData.saveStatus = 'Validation Failed';
            updatedAltPriceSubGridRowData.errorCode = action.errorMsg;
            const rowIndex = state.tabDetails[action.parentId][action.linePlan.shortenName][action.linePlan.dataElementFromService].map((d) => {return d[action.linePlan.identifier]; }).indexOf(action.childId);
            return Object.assign({}, state, {
                tabDetails: (state.tabDetails[action.parentId][action.linePlan.shortenName][action.linePlan.dataElementFromService].length > 0 && state.tabDetails[action.parentId] !== undefined) ? {
                    ...state.tabDetails,
                    [action.parentId]: {
                        ...state.tabDetails[action.parentId],
                        [action.linePlan.shortenName]: {
                            ...state.tabDetails[action.parentId][action.linePlan.shortenName],
                            [action.linePlan.dataElementFromService]: state.tabDetails[action.parentId][action.linePlan.shortenName][action.linePlan.dataElementFromService].map((row, i) => {
                                if (rowIndex === i)  {
                                    return updatedAltPriceSubGridRowData;
                                }
                                return row;
                            })
                        }
                    }
                } : {...state.tabDetails}
            });
        case ACTIONS.ADD_NEW_ENTRY_IN_TABDETAILS:
            if (state.tabDetails[action.id] === undefined) {
                return Object.assign({}, state, {tabDetails: {...state.tabDetails, [action.id]: {}}});
            }
            return state;
        case ACTIONS.REMOVE_NEW_ENTRY_IN_TABDETAILS:
            if (state.tabDetails[action.id] !== undefined) {
                let hasNewObject = false;
                if (state.tabDetails[action.id].CPO !== undefined && state.tabDetails[action.id].CPO.countryProductOfferings !== undefined && state.tabDetails[action.id].CPO.countryProductOfferings.length > 0) {
                    state.tabDetails[action.id].CPO.countryProductOfferings.forEach((cpo) => {
                        if (cpo.cpoId.toString().substring(0, 3).toLowerCase() === 'new') {
                            hasNewObject = true;
                        }
                    });
                }
                if (state.tabDetails[action.id].GPO !== undefined && state.tabDetails[action.id].GPO.geographyProductOfferings !== undefined && state.tabDetails[action.id].GPO.geographyProductOfferings.length > 0) {
                    state.tabDetails[action.id].GPO.geographyProductOfferings.forEach((gpo) => {
                        if (gpo.gpoId.toString().substring(0, 3).toLowerCase() === 'new') {
                            hasNewObject = true;
                        }
                    });
                }
                if (!hasNewObject) {
                    return Object.assign({}, update(state, {tabDetails: { $unset: [action.id]}}));
                }
            }
            return state;
        case ACTIONS.ADD_NEW_ENTRY_IN_OBJECTCREATEEDIT:
            return Object.assign({}, state, {objectCreateEdit: {...state.objectCreateEdit, [action.id]: {}}});
        case ACTIONS.REMOVE_NEW_ENTRY_IN_OBJECTCREATEEDIT:
            return Object.assign({}, update(state, {objectCreateEdit: { $unset: [action.id]}}));
        case SEARCH_PANE_ACTIONS.LINE_PLAN_CHANGE:
        case SEARCH_PANE_ACTIONS.DO_LINEPLAN_SEARCH:
            return Object.assign({}, state, {tabDetails: {}, objectCreateEdit: {}});
        case PO_ACTIONS.SAVE_PO_EDITS_SUCCESS_UPDATE_GRID:
        case PO_ACTIONS.GET_DATA_FOR_PO_EDIT_SUCCESS:
        case PO_ACTIONS.GET_DATA_FOR_PO_CREATE_SUCCESS:
        case ACTIONS.GET_DATA_FOR_GMO_EDIT_SUCCESS:
        case ACTIONS.GET_DATA_FOR_PRODUCT_GRID_SUCCESS:
        case ACTIONS.GET_DATA_FOR_CPO_CREATE_EDIT_SUCCESS:
        case ACTIONS.GET_DATA_FOR_CMO_EDIT_SUCCESS:
        case ACTIONS.GET_DATA_FOR_GPO_EDIT_SUCCESS:
        case MO_ACTIONS.GET_DATA_FOR_MO_CREATE_EDIT_SUCCESS:
        case ACTIONS.GET_DATA_FOR_MODEL_EDIT_SUCCESS:
        case ACTIONS.GET_DATA_FOR_EDIT_PRODUCT_SUCCESS:
        case ACTIONS.SAVE_PRODUCT_EDITS_UPDATE:
            return Object.assign({}, state, {objectCreateEdit: {...state.objectCreateEdit, [action.identifier]: {...state.objectCreateEdit[action.identifier], data: action.data}}});
        case ACTIONS.SAVE_PRODUCT_EDITS_SUCCESS_UPDATE_SUBGRID:
        case ACTIONS.SAVE_PRODUCT_EDITS_SUCCESS_UPDATE_GRID:
            return updateGrid(state, action, 'Product', action.modelOfferingId);
        case ACTIONS.GET_COLOR_PALETTES_SUCCESS:
            return Object.assign({}, state, {colorPalettes: action.data.colorPalettes});
        case MO_ACTIONS.ADD_NEW_MO_IN_SUBGRID:
            if(state.tabDetails && state.tabDetails[action.identifier] !== undefined) {
                let MO_L1 = {};
                const PO_L1 = [];
                const mapL1fromL3 = (response, mappings) => {
                    const L1 = {};
                    for (const key in mappings) {
                        if (typeof mappings[key] === 'string') {
                            const elements = mappings[key].split('.');
                            L1[key] = null;
                            if (elements.length > 0) {
                                let elementData = response;
                                elements.forEach((elm) => {
                                    if (elementData[elm] !== undefined) {
                                        elementData = elementData[elm];
                                    } else if (MO_L1[key] !== undefined && elementData[elm] === undefined) {
                                        elementData = '';
                                    } else {
                                        elementData = (MO_L1[key] !== undefined) ? MO_L1[key] : '';
                                    }
                                });
                                L1[key] = elementData;
                            }
                        } else if (Array.isArray(mappings[key]) && action.data[mappings[key][0]] !== undefined) {
                            L1[key] = [];
                            action.data[mappings[key][0]].forEach((element) => {
                                L1[key].push(element[mappings[key][1]]);
                            });
                        }
                    }
                    return L1;
                };

                MO_L1 = mapL1fromL3(action.data, MO_GRID_MAPPING_L1_FROM_L3);
                if (action.data.productOfferings && action.data.productOfferings.length > 0) {
                    action.data.productOfferings.map((PO_L3) => {
                        if (state.tabDetails[action.identifier].Product && PO_L3.product) {
                            const mappedPOL1 = mapL1fromL3(PO_L3.product, PRODUCT_GRID_MAPPING_L1_FROM_L3);
                            PO_L1.push(mappedPOL1);
                        }
                    });
                }
                if(PO_L1 && PO_L1.length > 0) {
                    return Object.assign({}, update(state, {
                        tabDetails: {
                            [action.identifier]: {
                                MO: {modelOfferings: {$push: [MO_L1]}},
                                Product: {products: {$push: PO_L1}}
                            }
                        }
                    }));
                }
                return Object.assign({}, update(state, {
                    tabDetails: {
                        [action.identifier]: {
                            MO: {modelOfferings: {$push: [MO_L1]}}
                        }
                    }
                }));
            }
            return state;
        case MO_ACTIONS.ADD_NEW_MOS_IN_SUBGRID:
            if (state.tabDetails && state.tabDetails[action.identifier] !== undefined) {
                if (action.data.length > 0) {
                    const moRows = [];
                    _.map(action.data, (data) => {
                        if (data) {
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
                            moRows.push(MO_L1);
                        }
                    });
                    const moDetails = Object.assign({}, state.tabDetails[action.identifier].MO);
                    moDetails.modelOfferings = moDetails.modelOfferings.concat(moRows);
                    return Object.assign({}, state, {tabDetails: {
                        ...state.tabDetails, [action.identifier]: {...state.tabDetails[action.identifier], MO: moDetails}
                    }});
                }
            }
            return state;
        case ACTIONS.GET_COLORS_SUCCESS:
            return Object.assign({}, state, {colors: action.data.colors});
        case ACTIONS.SAVE_DATA_FOR_CMO_SUCCESS_UPDATE_GRID:
            return updateSubGridFromMainGrid(state, action, 'CPO');
        case ACTIONS.SAVE_GMO_EDITS_SUCCESS_UPDATE_GRID:
            return updateSubGridFromMainGrid(state, action, 'GPO');
        case ACTIONS.SAVE_MODEL_EDIT_SUCCESS_UPDATE_GRID:
            return updateSubGridFromMainGrid(state, action, 'GLOBAL');
        case ACTIONS.UPDATE_NEW_CPO_IN_SUBGRID:
        case ACTIONS.SAVE_CPO_EDITS_SUCCESS_UPDATE_GRID:
            if (action.data.countryModelOffering !== undefined) {
                return updateGrid(state, action, 'CPO', action.data.countryModelOffering.cmoId);
            }
            return state;
        case ACTIONS.UPDATE_NEW_GPO_IN_SUBGRID:
        case ACTIONS.SAVE_GPO_EDITS_SUCCESS_UPDATE_GRID:
            if (action.data.geographyModelOffering !== undefined) {
                return updateGrid(state, action, 'GPO', action.data.geographyModelOffering.gmoId);
            }
            return state;
        case MO_ACTIONS.UPDATE_MO_IN_SUBGRID:
        case MO_ACTIONS.SAVE_MO_EDITS_SUCCESS_UPDATE_GRID:
            if (action.data.model !== undefined) {
                return updateGrid(state, action, 'MO', action.data.model.modelId);
            }
            return state;
        case PO_ACTIONS.UPDATE_NEW_PO_IN_SUBGRID:
            const moId = action.data.moId ? action.data.moId : action.data.modelOffering.moId;
            if (moId !== undefined) {
                return updateGrid(state, action, 'PO', moId);
            }
            return state;
        /* case ACTIONS.SAVE_GMO_EDITS_SUCCESS_UPDATE_GRID:
            return Object.assign({}, state, {objectCreateEdit: {...state.objectCreateEdit, [action.identifier]: {...state.objectCreateEdit[action.identifier], data: action.data}}}); */
        case ACTIONS.POPULATE_GPO_SUCCESS:
            return Object.assign({}, state, {objectCreateEdit: {...state.objectCreateEdit, [action.identifier]: {...state.objectCreateEdit[action.identifier], GPOData: action.data}}});
        case ACTIONS.GET_EXCHANGE_RATE_SUCCESS:
            return Object.assign({}, state, {objectCreateEdit: {...state.objectCreateEdit, [action.identifier]: {...state.objectCreateEdit[action.identifier], exchangeRateData: action.data}}});
        case ACTIONS.REMOVE_CMO_IN_MAIN_GRID:
        case ACTIONS.REMOVE_GMO_IN_MAIN_GRID:
        case MO_ACTIONS.REMOVE_MO_IN_MAIN_GRID:
            if (state.tabDetails[action.value] !== undefined) {
                return Object.assign({}, update(state, {tabDetails: { $unset: [action.value]}}));
            }
            return state;
        case ACTIONS.REMOVE_CPO_IN_SUBGRID:
            const cpoindex = state.tabDetails[action.linePlanIdentifier].CPO.countryProductOfferings.findIndex((d) => d[action.identifier] === action.value);
            if (cpoindex !== -1) {
                return Object.assign({}, update(state, {
                    tabDetails: {
                        [action.linePlanIdentifier]: {
                            CPO: {
                                countryProductOfferings: {$splice: [[cpoindex, 1]]}
                            }
                        }
                    }
                }));
            }
            return state;
        case ACTIONS.REMOVE_GPO_IN_SUBGRID:
            const gpoindex = state.tabDetails[action.linePlanIdentifier].GPO.geographyProductOfferings.findIndex((d) => d[action.identifier] === action.value);
            if (gpoindex !== -1) {
                return Object.assign({}, update(state, {
                    tabDetails: {
                        [action.linePlanIdentifier]: {
                            GPO: {
                                geographyProductOfferings: {$splice: [[gpoindex, 1]]}
                            }
                        }
                    }
                }));
            }
            return state;
        case PO_ACTIONS.REMOVE_PO_IN_SUBGRID:
            const poindex = state.tabDetails[action.linePlanIdentifier].PO.productOfferings.findIndex((d) => d[action.identifier] === action.value);
            if (poindex !== -1) {
                return Object.assign({}, update(state, {
                    tabDetails: {
                        [action.linePlanIdentifier]: {
                            PO: {
                                productOfferings: {$splice: [[poindex, 1]]}
                            }
                        }
                    }
                }));
            }
            return state;
        case ACTIONS.UPDATE_NEW_CMO_IN_GRID:
            if (state.tabDetails[action.identifier] !== undefined) {
                const tabData = Object.assign({}, state.tabDetails[action.identifier]);
                const updatedData = tabData.CPO;
                if (action.data.error === undefined && tabData.CPO !== undefined && updatedData !== undefined && updatedData.countryProductOfferings !== undefined && updatedData.countryProductOfferings.length > 0) {
                    updatedData.countryProductOfferings.forEach((row) => {
                        row.cmoId = action.data.cmoId;
                    });
                    let stateData = Object.assign({}, update(state, {tabDetails: { $unset: [action.identifier]}}));
                    if (updatedData !== undefined) {
                        stateData = Object.assign({}, stateData, {tabDetails: {...stateData.tabDetails, [action.data.cmoId]: {}}});
                        return Object.assign({}, stateData, {tabDetails: {...stateData.tabDetails, [action.data.cmoId]: {...stateData.tabDetails[action.data.cmoId], CPO: updatedData}}});
                    }
                /* } else if (action.data.error !== undefined) {
                    if ( action.data.error.duplicateObject !== undefined && action.data.error.duplicateObject !== null && action.data.error.message.indexOf('Duplicate ID error') !== -1 && tabData !== undefined) { // create object condition
                        return Object.assign({}, update(state, {tabDetails: { $unset: [action.identifier]}}));
                    }
                } else {
                    const stateData = Object.assign({}, update(state, {tabDetails: { $unset: [action.identifier]}}));
                    return Object.assign({}, stateData, {tabDetails: {...stateData.tabDetails, [action.data.cmoId]: {}}}); */
                }
                return state;
            }
            return state;
        case ACTIONS.UPDATE_NEW_GMO_IN_GRID:
            if (state.tabDetails[action.identifier] !== undefined) {
                const tabData = Object.assign({}, state.tabDetails[action.identifier]);
                const updatedData = tabData.GPO;
                if (action.data.error === undefined && tabData.GPO !== undefined && updatedData !== undefined && updatedData.geographyProductOfferings !== undefined && updatedData.geographyProductOfferings.length > 0) {
                    updatedData.geographyProductOfferings.forEach((row) => {
                        row.gmoId = action.data.gmoId;
                    });
                    let stateData = Object.assign({}, update(state, {tabDetails: { $unset: [action.identifier]}}));
                    if (updatedData !== undefined) {
                        stateData = Object.assign({}, stateData, {tabDetails: {...stateData.tabDetails, [action.data.gmoId]: {}}});
                        return Object.assign({}, stateData, {tabDetails: {...stateData.tabDetails, [action.data.gmoId]: {...stateData.tabDetails[action.data.gmoId], GPO: updatedData}}});
                    }
                /* } else if (action.data.error !== undefined) {
                    if ( action.data.error.duplicateObject !== undefined && action.data.error.duplicateObject !== null && action.data.error.message.indexOf('Duplicate ID error') !== -1 && tabData !== undefined) { // create object condition
                        return Object.assign({}, update(state, {tabDetails: { $unset: [action.identifier]}}));
                    }
                } else {
                    const stateData = Object.assign({}, update(state, {tabDetails: { $unset: [action.identifier]}}));
                    return Object.assign({}, stateData, {tabDetails: {...stateData.tabDetails, [action.data.gmoId]: {}}}); */
                }
                return state;
            }
            return state;
        case MO_ACTIONS.UPDATE_NEW_MO_IN_MAINGRID:
            if (state.tabDetails[action.identifier] !== undefined) {
                const tabData = Object.assign({}, state.tabDetails[action.identifier]);
                const updatedData = tabData.PO;
                if (action.data.error === undefined && tabData.PO !== undefined && updatedData !== undefined && updatedData.productOfferings !== undefined && updatedData.productOfferings.length > 0) {
                    updatedData.productOfferings.forEach((row) => {
                        row.moId = action.data.moId;
                    });
                    let stateData = Object.assign({}, update(state, {tabDetails: { $unset: [action.identifier]}}));
                    if (updatedData !== undefined) {
                        stateData = Object.assign({}, stateData, {tabDetails: {...stateData.tabDetails, [action.data.moId]: {}}});
                        return Object.assign({}, stateData, {tabDetails: {...stateData.tabDetails, [action.data.moId]: {...stateData.tabDetails[action.data.moId], PO: updatedData}}});
                    }
                /* } else if (action.data.error !== undefined) {
                    if ( action.data.error.duplicateObject !== undefined && action.data.error.duplicateObject !== null && action.data.error.message.indexOf('Duplicate ID error') !== -1 && tabData !== undefined) { // create object condition
                        return Object.assign({}, update(state, {tabDetails: { $unset: [action.identifier]}}));
                    }
                } else {
                    const stateData = Object.assign({}, update(state, {tabDetails: { $unset: [action.identifier]}}));
                    return Object.assign({}, stateData, {tabDetails: {...stateData.tabDetails, [action.data.moId]: {}}}); */
                }
                return state;
            }
            return state;
        case MO_ACTIONS.MOVE_MO:
            let sourceTabData = null;
            let targetTabData = null;
            if (state.tabDetails[action.sourceModelID] !== undefined && state.tabDetails[action.sourceModelID].MO !== undefined) {
                sourceTabData = Object.assign({}, state.tabDetails[action.sourceModelID].MO);
                action.moIDsToRemove.forEach((moToRemove) => {
                    const sourceMOindex = sourceTabData.modelOfferings.map(data => data.moId).indexOf(moToRemove);
                    sourceTabData.modelOfferings.splice(sourceMOindex, 1);
                });
            }
            if (state.tabDetails[action.targetModelID] !== undefined && state.tabDetails[action.targetModelID].MO !== undefined) {
                targetTabData = Object.assign({}, state.tabDetails[action.targetModelID].MO);
                targetTabData.modelOfferings = targetTabData.modelOfferings.concat(action.MOsToAdd);
            }
            if (sourceTabData !== null && targetTabData !== null) {
                return Object.assign({}, state, {tabDetails: {
                    ...state.tabDetails, [action.sourceModelID]: {...state.tabDetails[action.sourceModelID], MO: sourceTabData}, [action.targetModelID]: {...state.tabDetails[action.targetModelID], MO: targetTabData}
                }});
            } else if (sourceTabData !== null) {
                return Object.assign({}, state, {tabDetails: {
                    ...state.tabDetails, [action.sourceModelID]: {...state.tabDetails[action.sourceModelID], MO: sourceTabData}
                }});
            } else if (targetTabData !== null) {
                return Object.assign({}, state, {tabDetails: {
                    ...state.tabDetails, [action.targetModelID]: {...state.tabDetails[action.targetModelID], MO: targetTabData}
                }});
            }
            return state;
        case PO_ACTIONS.UPDATE_IMAGE_PUBLISH_STATUS_IN_SUB_GRID:
            let tabData = null;
            if (state.tabDetails[action.tabKey] !== undefined && state.tabDetails[action.tabKey].PO !== undefined) {
                tabData = Object.assign({}, state.tabDetails[action.tabKey].PO);
                action.changePoId.forEach((poToRemove) => {
                    const sourcePOindex = tabData.productOfferings.map(data => data.productId).indexOf(poToRemove);
                    tabData.productOfferings[sourcePOindex].imagePublishStatus = action.publishStatus;
                });
            }
            if (tabData !== null) {
                return Object.assign({}, state, {tabDetails: {
                    ...state.tabDetails, [action.tabKey]: {...state.tabDetails[action.tabKey], PO: tabData}
                }});
            }
            // action.moIDsToRemove.forEach((moToRemove) => {
            //     const sourceMOindex = sourceTabData.modelOfferings.map(data => data.moId).indexOf(moToRemove);
            //     sourceTabData.modelOfferings.splice(sourceMOindex, 1);
            // });
            // targetTabData = Object.assign({}, state.tabDetails[action.targetModelID].MO);
            // targetTabData.modelOfferings = targetTabData.modelOfferings.concat(action.MOsToAdd);
            // return Object.assign({}, state, {tabDetails: {
            //     ...state.tabDetails, [action.sourceModelID]: {...state.tabDetails[action.sourceModelID], MO: sourceTabData}, [action.targetModelID]: {...state.tabDetails[action.targetModelID], MO: targetTabData}
            // }});
            // return state;
            return state;
        case PO_ACTIONS.UPDATE_MOVE_PO_STATUS_IN_SUB_GRID:
            const tab = Object.assign({}, state.tabDetails[action.tabKey].PO);
            action.targetPos.forEach(targetPo => {
                const sourcePOindex = tab.productOfferings.map(data => data.productOfferingId).indexOf(targetPo.productOfferingId);
                tab.productOfferings[sourcePOindex].active = targetPo.active;
                tab.productOfferings[sourcePOindex].productCOStatus = targetPo.productCOStatus;
            });
            return Object.assign({}, state, {tabDetails: {
                ...state.tabDetails, [action.tabKey]: {...state.tabDetails[action.tabKey], PO: tab}
            }});
        default:
            return state;
    }
}

export default GridPaneReducer;
