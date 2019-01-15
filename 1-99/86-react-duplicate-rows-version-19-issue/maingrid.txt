import React from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import _ from 'lodash';

import './style.scss';
import VLPReportContainer from '../../containers/VLPReportContainer';
import {AgGridReact} from 'ag-grid-react';
import {GRID_COLUMNS} from '../../config/gridConfig/gridColumnConfig';
import 'ag-grid-enterprise';
import 'react-reflex/styles.css';
import { LINEPLAN_EDITABLE_FIELDS, LINEPLAN_NONEDITABLE_FIELDS } from '../../constants/editableFieldConstants';
import {GRID_CONTEXT_MENUS} from '../../constants/gridContextMenus';
import UserPreferenceService from '../../services/userPreferenceService';
import { ModalManager } from '../../components/common/modal';
import RowExpanderContainer from '../../containers/rowExpanderContainer';
import { validationMessages } from '../../constants/errorMessages';
import BreadCrumb from './components/breadCrumb';
import FiltersList from './components/filtersList';
import {GROUP_AGG_CONTEXT} from '../../constants/gridGroupingAggContext';
import GroupRowInnerRenderer from './groupRowInnerRenderer';
import moment from 'moment';
import MessageService, {messageTypes, messageBoxTypes} from  '../../services/messagingService';
import Privileges from  '../../services/privilegesService';
import LookupTypes from '../../services/lookupTypesService';
import subSearchIdentifiers from './components/rowExpanderElement/subSearchIdentifiers';
import { getFinalSearchUrl } from '../../actions/searchPaneActions';
/**
 * Sets the look up instance
 */
const _lookups = LookupTypes.getInstance();
// then you can import the components
import {
    ReflexContainer,
    ReflexSplitter,
    ReflexElement
} from 'react-reflex';
import DB from  '../../services/DBService';
import { gridPaneUtils } from './utils/gridPaneUtils';
import { setTimeout } from 'timers';
import { gridModals } from './gridModals';
import {contextMenuActions} from './contextMenuActions';

import { APICONSTANTS } from '../../constants/apiConstants';
import {constructServiceUrl} from '../../services/constructUrl';
import {defaultAction} from '../../services/restService';
// import XLSX from 'xlsx';
import renderer from '../../components/gridPane/renderers/fieldRenderer';
import UTILS from '../../services/utils';
/* eslint  react/prop-types: 0 */
/* eslint no-loop-func: 0 */

let _userPreferenceService;
/**
 * Sets the message service instance
 */
const _MessageService = MessageService.getInstance();
/**
 * Sets the db instance
 */
const _DB = DB.getInstance();
let _privileges;
/**
* This component creates the grid.
* @example
*<GridPane
*    panes={this.props.panes}
*    stateName={this.props.stateName}
*    hideLoader={this.props.hideLoader}
*    currentProfile={this.props.currentProfile}
*    searchData={this.props.searchData}
*    gridData={this.props.gridData}
*    editedData={this.state.editedData}
*    linePlan={this.props.linePlan}
*    updatePreference={this.updatePreference}
*    preference={this.getUserPreference()}
*    closePane={this.props.closePane}
*    showHideSearchPane={this.props.showHideSearchPane}
*    splitterView={this.props.splitterView}
*    saveEditedData={this.saveEditedData}
*    addNewObjects={this.addNewObjects}
*    tabDetails={this.props.tabDetails}
*    hasNewObjects={this.state.newData.child.length > 0 || this.state.newData.parent.length > 0}
*    isGridEdited={this.state.editedData.length > 0}
*    removeNewRow={this.removeNewRow}
*    removeObjectInState={this.removeObjectInState}
*    setEditedData={(editedData) => {this.setState({editedData});}}
*    saveNewObjects={this.saveNewObjects}
*    saveMassEdits={this.saveMassEdits}
*    searchStarted={this.props.searchStarted}
*    setSearchingStatus={this.props.setSearchingStatus}
*    updateEditModePaneFlag={this.props.updateEditModePaneFlag}
*    setEditedDataFlag={this.props.setEditedDataFlag}
*    />
*/
export default class GridPane extends React.Component {
    /**
      * creates an instance of Gridpane.
      * @param {func} setEditedDataFlag - to update flag if any fields are edited
      * @param {string} linePlan - information regarding the linePlan
      * @param {object} searchData - information regarding search data/criteria
      * @param {object} gridData - information regarding data/rows populated in grid
      */
    constructor(props) {
        super(props);
        /**
        * @type {object}
        * @property {boolean} showPPTPaneView - boolean to show/hide PPTPane
        * @property {object} columnDefs - data regarding column namespace
        * @property {object} rowData - data for populating grid
        * @property {boolean} editGrid - boolean to check if grid is in edit mode
        * @property {boolean} restoreDefault - boolean to check if grid preference is set to original grid preference
        * @property {object} appliedFilters - data regarding the filters applied on gridData
        * @property {boolean} showNoResultsMsg - boolean to show message if there is no grid data for a particular search criteria
        */
        this.state = {
            showPPTPaneView: false,
            columnDefs: [],
            rowData: [],
            editGrid: false,
            restoreDefault: false,
            appliedFilters: null,
            showNoResultsMsg: false
        };
    }
    /**
     *Invoked before component is rendered.
     */
    componentDidMount = () => {
        ......
        }
    }
    /**
     * updates state with new data
     * @param {object} newProps
     */
    componentWillReceiveProps(newProps)
        if (this.props.gridData !== newProps.gridData) {

            let updatedData = [];
            updatedData = update(this.state.rowData, {$set: _.cloneDeep(newData)});
            if (this.state.editGrid) {
                if (this.props.editCounter !== 0 && newProps.editCounter === 0 && newProps.editedData.length > 0) {
                    updatedData = _.map(updatedData, (item) => {
                        const data = _.extend(_.cloneDeep(item), _.find(newProps.editedData, { [this.props.linePlan.identifier]: item[this.props.linePlan.identifier] }));
                        data.saveStatus = item.saveStatus;
                        data.errorCode = item.errorCode;
                        data.saveMessage = item.saveMessage;
                        return data;
                    });
                }
                updatedData = _.cloneDeep(updatedData);
            }
            let sortValue = '';
            if (this.props.linePlan.name === 'GPO') {
                sortValue = _.sortBy(updatedData, [updatedDatas => updatedDatas.gpoId]);
            }
            this.setState({rowData: sortValue, showNoResultsMsg}, () => {
                setTimeout(() => {
                    if (this.gridApi) {
                        this.gridApi.setRowData(this.state.rowData);
                        const appliedFilters = this.state.appliedFilters;
                        // reset the filter to reflect the data changes in grid
                        this.gridApi.setFilterModel(null);
                        this.gridApi.setFilterModel(appliedFilters);
                        if (oldData.length === 0) {
                            this.updateBottomPinnedRow(true);
                        } else {
                            this.updateBottomPinnedRow();
                        }
                        if (this.state.editGrid) {
                            this.toggleGridEdit(this.state.editGrid, newProps.gridData);
                        }
                        this.highlightNewObjectRow();
                    }
                }, ((this.props.defaultSettings === null) ? 0 : 200));
            });
        }
        if (this.props.linePlan !== newProps.linePlan) {
            if (this.gridApi) {
                this.gridApi.setRowData([]);
            }
            this.setState({editGrid: false, showPPTPaneView: false, rowData: [], appliedFilters: null, showNoResultsMsg: false, dataObjArr: null, spanObjArr: null, reportType: null, pptRows: null, pptColumns: null}, () => {
                if (this.gridApi) {
                    this.gridApi.redrawRows();
                    this.gridApi.setPinnedBottomRowData([]);
                }
            });
        }
    }

    /**
     *invokes when state is updated.
     */
    componentWillUpdate = (nextProps, nextState) => {
        if (this.state.editGrid !== nextState.editGrid && this.gridApi) {
            this.toggleGridEdit(nextState.editGrid, nextProps.gridData/* , nextState.columnDefs, nextProps.linePlan.name*/);
            if (nextState.editGrid) {
                this.props.setEditedData([]);
            }
            let rData = [];
            if (nextProps.gridData[this.props.linePlan.dataElementFromService] !== undefined) {
                rData = nextProps.gridData[this.props.linePlan.dataElementFromService];
            }
            for (let i = 0; i < rData.length; i++) {
                rData[i].saveMessage = '';
                rData[i].saveStatus = '';
                rData[i].errorCode = '';
            }
            if (nextState.editGrid) {
                rData = _.cloneDeep(rData);
            }
            if (nextState.rowData !== rData) {
                let sortValue = '';
                if(this.props.linePlan.name === 'GPO') {
                    sortValue =  _.sortBy(rData, [rDatas => rDatas.gpoId]);
                }
                //  const sortedData = _.sortBy(rData, [rDatas => this.props.linePlan.name === 'GPO' ? rDatas.gpoId : rDatas.marketingName.toLowerCase()]);
                this.setState({rowData: sortValue}, () => {
                    this.gridApi.setRowData(sortValue);
                });
            }
        }
        if (this.props.linePlan.name !== nextProps.linePlan.name && this.props.linePlan.name !== '' && this.gridApi) {
            this.toggleGridEdit(false, nextProps.gridData, nextState.columnDefs, nextProps.linePlan.name);
        }
        if (nextState.restoreDefault) {
            this.toggleGridEdit(this.state.editGrid, nextProps.gridData, GRID_COLUMNS[nextProps.linePlan.name].slice(), nextProps.linePlan.name );
        }
    }
    /**
     *Invoked when component is to be removed from DOM.
     */
    componentWillUnmount = () => {
        if (this.gridApi !== undefined && this.gridApi.rowModel !== undefined && this.gridApi.rowModel.rowsToDisplay.length > 0 && this.props.linePlan.name !== 'COUNTRY') {
            this.gridApi.rowModel.rowsToDisplay.forEach((row) => {
                if (row.eventService !== undefined && row.removeEventListener !== undefined) {
                    row.removeEventListener('dragstart');
                    row.removeEventListener('drag');
                    row.removeEventListener('dragend');
                    if (this.props.linePlan.name === 'MODEL') {
                        row.removeEventListener('dragover');
                        row.removeEventListener('dragleave');
                        row.removeEventListener('drop');
                    }
                }
            });
        }
        if (this.gridContainerElm) {
            this.gridContainerElm.removeEventListener('drop', this.onDropInGrid);
            this.gridContainerElm.removeEventListener('dragover', this.validateDraggedData);
            this.gridContainerElm.removeEventListener('keydown', this.onKeyDown);
        }
    }
    /**
     * to highlight a new row.
     */
    highlightNewObjectRow = () => {
        this.gridApi.forEachNode((node) => {
            if (node.data !== undefined && node.data[this.props.linePlan.identifier] !== undefined && node.data[this.props.linePlan.identifier].toString().substring(0, 3).toLowerCase() === 'new') {
                node.setSelected(true);
            }
        });
    }
    /**
     * to apply filters.
     * @param {object} params - holds grid information.
     */
    setAppliedFilters = (params) => {
        const appliedFilters = params.api.getFilterModel();
        this.setState({appliedFilters});
        this.updateBottomPinnedRow();
    }
    /**
     * to remove filters.
     * @param {string} colId - holds column Id of column to remove filter from.
     */
    removeFilter = (colId) => {
        const appliedFilters = _.cloneDeep(this.state.appliedFilters);
        delete appliedFilters[colId];
        this.setState({appliedFilters}, () => {
            setTimeout(() => {this.gridApi.setFilterModel(this.state.appliedFilters);}, 10);
            this.updateBottomPinnedRow();
        });
    }
    /**
     *To load the Grid with columns and data.
     * @param {string} params - Grid API's and information.
     */
    onGridReady = (params) => {
        /**
         * Sets the grid api
         */
        this.gridApi = params.api;
        /**
         * Sets the column api
         */
        this.columnApi = params.columnApi;
        this.gridApi.setRowData([]);
        this.toggleGridEdit(this.state.editGrid);
        this.gridContainerElm.addEventListener('drop', this.onDropInGrid);
        this.gridContainerElm.addEventListener('dragover', this.validateDraggedData);
        this.gridContainerElm.addEventListener('keydown', this.onKeyDown);
        // this.gridApi.sizeColumnsToFit();
    }
    /**
     *To invoke onKey down.
     * @param {Object} e - event handler.
     */
    onKeyDown = (e) => {
        const params = {};
        const currentCell = this.gridApi.getFocusedCell();
        const currentCellrowIndex = currentCell ? currentCell.rowIndex : undefined;
        const rowNode = this.gridApi.getDisplayedRowAtIndex(currentCellrowIndex);
        params.node = rowNode;
        params.data = rowNode ? rowNode.data : undefined;
        if (!this.state.editGrid && e.key === 'Enter' && params.node !== undefined && !params.node.expanded) {
            this.openEditObjectModal(params);
        }
        if ((e.keyCode === 46 || e.keyCode === 8) && this.state.editGrid && !UTILS.IsNullOrEmptyOrUndefined(currentCell)) { // remove cell data if Delete key is pressed
            const ranges = this.gridApi.getRangeSelections();
            ranges.forEach(range => {
                this.gridApi.stopEditing();
                this.gridApi.clearFocusedCell();
                for(let rowIndex = range.start.rowIndex; rowIndex <= range.end.rowIndex; rowIndex ++) {
                    const row = this.gridApi.getDisplayedRowAtIndex(rowIndex);
                    range.columns.forEach(column => {
                        if ((typeof column.colDef.editable !== 'function' && column.colDef.editable === true) ||
                        (typeof column.colDef.editable === 'function' && column.colDef.editable(params))) {
                            row.setDataValue(column.colDef.colId, '');
                            if (column.colDef.colId === 'launchId') {
                                rowNode.setDataValue('launchDate', '');
                            }
                        }
                    });
                }
            });
        }
        if (e.ctrlKey && (e.keyCode === 65 || e.keyCode === 97) && !this.state.editGrid) {
            if (this.state.appliedFilters !== null) {
                this.gridApi.selectAllFiltered();
            } else {
                this.gridApi.selectAll();
            }
        }
    }
    /**
     *To remove a row from grid.
     */
    removeNewRow = (params) => {
        this.props.removeNewRow(params.node.data[this.props.linePlan.identifier]);
    }
    /**
     *To get the context menus.
     * @param {object} params - Grid details
     */
    getContextMenuItems = (params) => {
        let gridContextMenu = [];
        const rows = [];
        if (params.node !== undefined && params.node !== null && params.node.selected && (params.node.flower === undefined || !params.node.flower)) {
            for (const key in params.node.selectionController.selectedNodes) {
                if (!params.node.selectionController.selectedNodes.hasOwnProperty(key)) continue;
                const obj = params.node.selectionController.selectedNodes[key];
                if (obj !== undefined) {
                    rows.push(obj.data);
                }
            }
        }
        if (params.node !== undefined && params.node !== null && (params.node.flower === undefined || !params.node.flower)) {
            if (!this.state.editGrid && rows.length > 0) {
                if (params.column) {
                    if (params.node.selected && rows.length === 1) {
                        gridContextMenu = GRID_CONTEXT_MENUS[this.props.linePlan.name].NORMAL;
                    } else {
                        gridContextMenu = GRID_CONTEXT_MENUS[this.props.linePlan.name].SELECTED;
                    }
                }
            } else if (this.state.editGrid) {
                if (params.column) {
                    gridContextMenu.push({
                        name: 'Copy',
                        key: 'COPY'
                    });
                    gridContextMenu.push({
                        name: 'Copy with Header',
                        key: 'COPY_WITH_HEADER'
                    });
                    gridContextMenu = gridContextMenu.concat(GRID_CONTEXT_MENUS[this.props.linePlan.name].EDIT);
                }
            } else {
                return null;
            }
            gridContextMenu.map((menuItem) => {
                if (menuItem) {
                 ...
                    }
                    if (menuItem.subMenu) {
                        ...
                            }
                        });
                    }
                }
            });
        }
        if (!this.state.editGrid && (gridContextMenu === null || gridContextMenu.length === 0) && this.props.linePlan.name === 'MODEL') {
            gridContextMenu = [{
                name: 'Create Model',
                key: 'CREATE_MODEL',
                action: gridModals.openCreateEditModel.bind(this, params, this.props.stateName, this.props.linePlan.identifier, 'create', true, this.props.currentProfile),
                disabled: !Privileges.getInstance().isUserHasAccessFor('MODEL_CREATE')
            }];
        }
        return gridContextMenu;
    }
    /**
     *To revert cell data to its original form before editing.
     * @param {object} params - Grid details
     */
    revertCellDataToOriginal = (params) => {
        const originalRow = this.props.gridData[this.props.linePlan.dataElementFromService].find((row) => row[this.props.linePlan.identifier] === params.node.data[this.props.linePlan.identifier]);
        const gridIndex = this.state.rowData.findIndex((row) => row[this.props.linePlan.identifier] === originalRow[this.props.linePlan.identifier]);
        const gridData = this.state.rowData.slice();
        this.setState({rowData: update(gridData, {
            [gridIndex]: {
                [params.column.colId]: {$set: originalRow[params.column.colId]}
            }
        })});
        
    }
    /**
     *To export Grid data.
     * @param {object} params - Grid data
     */
    exportGrid = () => {
        if (this.props.linePlan.name === 'CPO') {
            const originalGridColumnData = this.columnApi.getAllDisplayedColumns().map(d => d.colDef);
            const gridColumnData = originalGridColumnData.slice();
            gridColumnData.unshift({colId: 'edited', headerName: 'Edited', field: 'edited', width: 55, suppressToolPanel: true, suppressMenu: true, suppressResize: true, suppressMovable: true, suppressSorting: true, id: 121, cellClass: 'edited'});
            gridColumnData.splice(gridColumnData.findIndex(data => data.colId === 'image'), 1);
            this.gridApi.setColumnDefs(gridColumnData);
            setTimeout(() => {
                this.gridApi.setColumnDefs(originalGridColumnData);
            }, 500);
        }
        const params = {
            fileName: this.props.linePlan.name + '_Export',
            sheetName: this.props.linePlan.name,
            skipFooters: true,
            suppressTextAsCDATA: true,
            shouldRowBeSkipped: (param) => {
                return param.node.data[this.props.linePlan.identifier] === null;
            },
            processCellCallback: (param) => {
                if(param.column.colDef.valueGetter) {
                    const valueGetterParam = param.node;
                    valueGetterParam.colDef = param.column.colDef;
                    if(param.column.colId === 'retailPrice') {
                        return param.node.data[param.column.colId];
                    } else if(param.column.colId === 'wholesalePrice') {
                        return param.node.data[param.column.colId];
                    } else if(param.column.colId === 'marketingTypeId') {
                        return renderer.marketingTypeId(valueGetterParam);
                    } else if(param.column.colId === 'marketingInitiativeIds') {
                        return renderer.marketingInitiativeIds(valueGetterParam);
                    }
                    return param.column.colDef.valueGetter(valueGetterParam);
                }
                return param.node.data[param.column.colId];
            }
        };
        this.gridApi.exportDataAsExcel(params);
    };
    /**
     * Returns excel styles
     */
    getCPOExcelStyles = () => {
        if (this.props.linePlan.name === 'CPO') {
            const styles = [{
                id: 'header',
                interior: {
                    color: '#9999cc',
                    pattern: 'Solid'
                }
            }, {
                id: 'edited',
                dataType: 'string',
                interior: {
                    color: '#c6efce',
                    pattern: 'Solid',
                    patternColor: '#c6efce'
                }
            }];
            const colEditable = [{colId: 'retailPrice', dataType: 'number'}, {colId: 'wholesalePrice', dataType: 'number'}, {colId: 'offerBeginDate', dataType: 'dateTime'}, {colId: 'futureOfferEndDate', dataType: 'dateTime'}, {colId: 'offerEndDate', dataType: 'dateTime'}, {colId: 'number', dataType: 'initialForecast'}, {colId: 'salesSample', dataType: 'string'}, {colId: 'cpoSalesSampleComment', dataType: 'string'}, {colId: 'cpoSalesSampleQuantity1', dataType: 'string'}, {colId: 'cpoSalesSampleQuantity2', dataType: 'string'}, {colId: 'cpoSalesSampleQuantity3', dataType: 'string'}, {colId: 'cpoSalesSampleQuantity4', dataType: 'string'}, {colId: 'cpoSalesSampleSizeId', dataType: 'string'}, {colId: 'marketingTypeId', dataType: 'string'}, {colId: 'initialForecast', dataType: 'number'}, {colId: 'alternatePrices', dataType: 'string'}, {colId: 'notes', dataType: 'string'}];
            this.state.columnDefs.slice().forEach((col) => {
                if (col.colId !== 'image' && col.colId !== 'saveStatus' && col.colId !== 'saveMessage' && !col.hide) {
                    const index = colEditable.findIndex(data => data.colId === col.colId);
                    if (index !== -1) {
                        styles.push({
                            id: col.colId,
                            // dataType: colEditable[index].dataType,
                            interior: {
                                color: '#c6efce',
                                pattern: 'Solid',
                                patternColor: '#c6efce'
                            }
                        });
                    } else {
                        styles.push({
                            id: col.colId,
                            interior: {
                                color: '#bfbfbf',
                                pattern: 'Gray125',
                                patternColor: '#bfbfbf'
                            }
                        });
                    }
                }
            });
            return styles;
        }
        return null;
    }
    /**
     *To export copy Grid data.
     * @param {object} includeHeader - Header information
     */
    copyGridContent = (includeHeader) => {
        this.gridApi.copySelectedRangeToClipboard(includeHeader);
    }
    /**
     *To update cell attributes.
     * @param {object} param - Grid data
     */
    updateCellAltAttr = (param) => {
        if (this.state.editGrid && param.colDef.cellClass.indexOf('editable') > 0) {
            if ( param.event.target.classList.contains('error')) {
                param.event.target.setAttribute('alt', validationMessages[this.checkErrors(param.colDef.colId, param)]);
            }
            const title = gridPaneUtils.getBubbleData(this.getElementData(param), param.colDef.colId);
            param.event.target.setAttribute('title', title);
        } else {
            param.event.target.setAttribute('title', '');
        }
    }
    /**
     *To change grid back and forth from edit mode.
     * @param {Array} columnDefs - Column definition
     * @param {string} linePlan - Line plan name
     * @param {boolean} editable - check if columns are editable or not.
     * @param {Array} propsGridData - Grid data
     */
    toggleGridEdit = (editable, propsGridData = [], columnDefs = [], linePlan = '') => {
        const gridColumnData = (columnDefs.length > 0) ? columnDefs : this.state.columnDefs.slice();
        const linePlanName = (linePlan !== '') ? linePlan : this.props.linePlan.name;
        gridColumnData.forEach((col) => {
            if (col.colId === 'expander') {
                if (editable) {
                    col.hide = true;
                } else {
                    col.hide = false;
                }
            }
            GRID_COLUMNS[linePlanName].forEach((defCol) => {
                if (defCol.colId === col.colId) {
                    if (defCol.toolPanelClass !== undefined) {
                        col.toolPanelClass = defCol.toolPanelClass;
                    }
                }
            });
        });
        for (let i = 0; i < gridColumnData.length; i++) {
            if (gridColumnData[i] !== undefined) {
                gridColumnData[i].filter = linePlanName === 'GLOBAL' && gridColumnData[i].field === 'marketingName' ? 'agTextColumnFilter' : 'agSetColumnFilter';
                gridColumnData[i].menuTabs = ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'];
                gridColumnData[i].cellClass = [gridColumnData[i].colId];
                let colIds = [];
                if (gridColumnData[i].colId === 'image') {
                    gridColumnData[i].suppressMenu = false;
                    gridColumnData[i].suppressFilter = true;
                }
                if (colIds.indexOf(gridColumnData[i].colId) !== -1) {
                    gridColumnData[i].cellClass.push('linkedObject');
                }
                if (editable) {
                    // const rowData = this.state.rowData.slice();
                    let rowData = [];
                    if (propsGridData[this.props.linePlan.dataElementFromService] !== undefined) {
                        rowData = propsGridData[this.props.linePlan.dataElementFromService].slice();
                    }
                    if (gridColumnData[i].editable !== undefined) {
                        if (gridColumnData[i].colId === 'changeReason' || gridColumnData[i].colId === 'note') {
                            gridColumnData[i].editable = (params) => {
                                const editableFields = [];
                                let editableField = false;
                                if (params.node) {
                                    this.columnApi.getAllColumns().forEach((column) => {
                                        if (column.colDef.field !== 'changeReason' && column.colDef.field !== 'note' && column.colDef.editable) {
                                            editableFields.push(column.colDef.field);
                                        }
                                    });
                                    const origValue = Object.assign({}, rowData.find(row => row[this.props.linePlan.identifier] === params.node.data[this.props.linePlan.identifier]));
                                    const objFields = ['marketingInitiativeIds', 'gpoAlternateMarketingTypeIds', 'primaryPlatform', 'construction', 'alternateMarketingTypeIds', 'specialOfferingTypeIds', 'globalCategoryCoreFocus', 'globalCategorySummary', 'athlete', 'moGroups', 'confidentialTo'];
                                    editableFields.forEach((element) => {
                                        let editFlag = false;
                                        if (!_.includes(objFields, element)) {
                                            editFlag = (params.node.data[element] !== origValue[element]);
                                        } else {
                                            editFlag = (!_.isEqual(params.node.data[element], origValue[element]));
                                        }
                                        if(editFlag && !editableField) {
                                            editableField = true;
                                            if(origValue[element] === undefined && params.node.data[element] === '' ) {
                                                editableField = false;
                                            }
                                            if(Array.isArray(origValue[element])) {
                                                if(origValue[element].length === 0 && params.node.data[element].length === 0 ) {
                                                    editableField = false;
                                                }
                                            }
                                        }
                                    });
                                }
                                if (!editableField) {
                                    return false;
                                }
                                return true;
                            };
                        } else {
                            gridColumnData[i].editable = editable;
                        }
                        gridColumnData[i].lockVisible = true;
                        gridColumnData[i].headerClass = gridColumnData[i].headerClass + ' editable';
                        gridColumnData[i].cellClass.push('editable');
                        gridColumnData[i].hide = false;
                        gridColumnData[i].cellClassRules = {
                            'highlight': (params) => {
                                if (params.node.rowPinned === undefined) {
                                    const column = params.colDef.colId;
                                    const index = rowData.map((d) => {return d[this.props.linePlan.identifier]; }).indexOf(params.data[this.props.linePlan.identifier]);
                                    let origValue = rowData[index];
                                    if (origValue !== undefined && origValue[column] !== undefined) {
                                        origValue = origValue[column];
                                    } else {
                                        origValue = null;
                                    }
                                    let newValue;
                                    if (origValue === null && params.data[column] === '') {
                                        newValue = null;
                                    } else {
                                        newValue = params.data[column];
                                    }
                                    if (newValue !== undefined && origValue !== undefined) {
                                        if (column.toLowerCase().search('retail') !== -1 ||  params.colDef.colId.toLowerCase().search('wholesale') !== -1) {
                                            origValue = parseFloat(origValue, 2).toFixed(2).toString();
                                            if (isNaN(newValue)) {
                                                newValue = newValue.toString().replace(new RegExp(',', 'g'), '');
                                            }
                                            if (!isNaN(newValue)) {
                                                newValue = parseFloat(newValue, 2).toFixed(2).toString();
                                            }
                                        } else if ((typeof origValue !== 'object' && typeof newValue !== 'object') || (Array.isArray(origValue) && Array.isArray(newValue))) {
                                            newValue = newValue.toString();
                                            origValue = origValue.toString();
                                            if (!Array.isArray(origValue) && !Array.isArray(newValue)) {
                                                newValue = newValue.toString().replace(new RegExp(',', 'g'), '');
                                                origValue = origValue.toString().replace(new RegExp(',', 'g'), '');
                                            }
                                        }
                                        let hasDifference = false;
                                        if (typeof origValue === 'object' && typeof newValue === 'object' && !Array.isArray(origValue) && !Array.isArray(newValue)) {
                                            hasDifference = !_.isEqual(origValue, newValue);
                                        } else {
                                            hasDifference = (newValue !== origValue);
                                        }
                                        return (hasDifference) && params.data.saveStatus !== 'SUCCESS';
                                    }
                                    return false;
                                }
                                return false;
                            }
                        };
                    } else {
                        gridColumnData[i].headerClass = gridColumnData[i].headerClass + ' nonEditable';
                        gridColumnData[i].cellClass.push('nonEditable');
                    }
                    if (LINEPLAN_EDITABLE_FIELDS[linePlanName][gridColumnData[i].field] !== undefined) {
                        const cellClassRules = gridColumnData[i].cellClassRules;
                        if (!_.isEmpty(cellClassRules)) {
                            const editableFields = LINEPLAN_EDITABLE_FIELDS[linePlanName][gridColumnData[i].field];
                            gridColumnData[i] = Object.assign(gridColumnData[i], editableFields, {cellClassRules: {...cellClassRules, ...editableFields.cellClassRules}});
                        } else {
                            gridColumnData[i] = Object.assign(gridColumnData[i], LINEPLAN_EDITABLE_FIELDS[linePlanName][gridColumnData[i].field]);
                        }
                        if (gridColumnData[i] && gridColumnData[i].cellEditorParams !== undefined && gridColumnData[i].cellEditorParams.values !== undefined && typeof gridColumnData[i].cellEditorParams.values === 'function') {
                            gridColumnData[i].cellEditorParams.values = gridColumnData[i].cellEditorParams.values();
                        }
                    }
                } else {
                    if (gridColumnData[i].editable !== undefined) {
                        gridColumnData[i].editable = editable;
                        gridColumnData[i].lockVisible = false;
                    }
                    gridColumnData[i].headerClass = gridColumnData[i].headerClass + ' nonEditable';
                    gridColumnData[i].cellClass.push('nonEditable');
                    gridColumnData[i].cellClassRules = {};
                    if (LINEPLAN_NONEDITABLE_FIELDS[linePlanName][gridColumnData[i].field] !== undefined) {
                        gridColumnData[i] = Object.assign(gridColumnData[i], LINEPLAN_NONEDITABLE_FIELDS[linePlanName][gridColumnData[i].field]);
                    }
                }
            }
        }
        this.gridApi.setColumnDefs(gridColumnData);
        // this.updatePinnedBottomRow();
        if (editable) {
            this.collapseAll();
            this.gridApi.deselectAll();
        }
        // this.gridApi.redrawRows();
        if (this.state.appliedFilters !== null) {
            setTimeout(() => {this.gridApi.setFilterModel(this.state.appliedFilters);}, 10);
        }
    }
    /**
     *To update data in Bottom pinned row in grid.
     * @param {boolean} createMode - to check the existence of the row
     */
    updateBottomPinnedRow = (createMode = false) => {
        const gridColumnData = this.state.columnDefs.slice();
        const rootChild = this.gridApi.getModel();
        if (rootChild) {
            const datas = {};
            gridColumnData.forEach((column) => {
                let displayText = null;
                GROUP_AGG_CONTEXT[this.props.linePlan.name].forEach((element) => {
                    if (element.field === column.field) {
                        displayText = element.title + ': ' + rootChild.rootNode.aggData[element.field];
                    }
                });
                datas[column.field] = displayText;
            });
            if (createMode) {
                this.gridApi.setPinnedBottomRowData([datas]);
            } else {
                if (this.gridApi.pinnedRowModel.pinnedBottomRows.length > 0) {
                    this.gridApi.pinnedRowModel.pinnedBottomRows[0].updateData(datas);
                }
            }
        }
    }
    /**
     *To Collapse an expanded row.
     */
    collapseAll = () => {
        this.gridApi.forEachNode(node =>{
            if (node.expanded) {
                node.expanded = false;
            }
        });
        this.gridApi.onGroupExpandedOrCollapsed();
    }
    /**
     *To save the defined property to user preference.
     */
    handleColumnVisible = () => {
        this.saveGridStateToPreference();
    }
    /**
     *To save the defined property to user preference.
     */
    handleColumnResize = () => {
        this.saveGridStateToPreference();
    }
    /**
     *To save the defined property to user preference.
     */
    handleColumnDrag = () => {
        this.saveGridStateToPreference();
    }
    /**
     *To save the defined property to user preference.
     */
    handleSortChange = () => {
        this.saveGridStateToPreference();
    }
    /**
     *To save the property to user preference.
     */
    saveGridStateToPreference = () => {
        ... 
    }
    /**
     *To handle after cell editing is stopped.
     * @param {object} params - Grid data
     */
    handleCellEditingStopped = (params) => {
        if (params.column.colDef.colId !== 'saveMessage' && params.column.colDef.colId !== 'saveStatus') {
            // If we are editing a select box style cell, check if it's value is
            // different and then force it to be the focused cell again.
            if (params.column.colDef.cellEditor === 'select' && params.oldValue !== params.newValue) {
                this.gridApi.clearRangeSelection();
                const rowIndex = params.rowIndex;
                const colKey = params.column.colId;
                this.gridApi.setFocusedCell(rowIndex, colKey);
                this.gridApi.startEditingCell({rowIndex, colKey});
            }

            const error = {errorCode: ''};
            // Global data check validation
            for (const key in params.node.data) {
                if (!params.node.data.hasOwnProperty(key)) continue;
                const errorMessage = this.checkErrors(key, params);
                if (errorMessage) {
                    error.errorCode = errorMessage;
                    break;
                }
            }
            const rowNode = this.gridApi.getRowNode(params.node.id);
            if (rowNode !== undefined) {
                if (error.errorCode !== '') {
                    rowNode.setDataValue('saveMessage', error);
                    rowNode.setDataValue('saveStatus', error ? 'Validation Failed' : '' );
                } else {
                    rowNode.setDataValue('saveMessage', '');
                    rowNode.setDataValue('saveStatus', '' );
                }
            }
            if ((params.value !== '' && params.value !== null) || (params.oldValue !== '' && params.oldValue !== null && params.newValue === '')) {
                this.editData(params);
            }
        }
    }
    /**
     *To handle Grid in edit mode.
     * @param {object} params - Grid data
     */
    editData = (params) => {
        const originalRow = this.props.gridData[this.props.linePlan.dataElementFromService].find((row) => row[this.props.linePlan.identifier] === params.node.data[this.props.linePlan.identifier]);
        this.props.setEditedDataFlag(true);
        const editedData = this.props.editedData.slice();
        const id = _.findIndex(editedData, {
            [this.props.linePlan.identifier]: params.node.data[this.props.linePlan.identifier],
        });
        /* const gridIndex = _.findIndex(this.state.rowData, {
            [this.props.linePlan.identifier]: params.data[this.props.linePlan.identifier],
        }); */
        if (id !== -1) {
            const updatedRow = update(editedData[id], {$set: params.node.data});
            const newData = update(editedData, {
                $splice: [
                    [id, 1, updatedRow],
                ],
            });
            this.props.setEditedData(newData);
        } else {
            // if (originalRow[params.colDef.colId] === undefined || (originalRow[params.colDef.colId].toString() !== params.data[params.colDef.colId].toString())) {
            if (!_.isEqual(originalRow, params.node.data)) {
                this.props.setEditedData(editedData.concat(params.node.data));
            }
        }
    }
    /**
     *To deal with grid data.
     * @param {object} params - Grid data
     */
    processCellDataFromClipboardBeforeUpdate = (params) => {
        const columnsToBeFormated = ['offerBeginDate', 'futureOfferEndDate', 'offerEndDate', 'launchDate', 'marketingInitiativeIds', 'gpoAlternateMarketingTypeIds', 'firstOfferDate'];
        if (_.includes(columnsToBeFormated, params.column.colDef.colId)) {
            const dateFields = ['offerBeginDate', 'futureOfferEndDate', 'offerEndDate', 'launchDate', 'firstOfferDate'];
            const arrayFields = ['marketingInitiativeIds', 'gpoAlternateMarketingTypeIds'];
            if (_.includes(dateFields, params.column.colDef.colId)) {
                if (params.value !== '' && moment(params.value) instanceof moment) {
                    return moment(params.value);
                } else if (params.node.data[params.column.colDef.colId] !== undefined && params.node.data[params.column.colDef.colId] !== null && params.node.data[params.column.colDef.colId] !== '' && moment(params.node.data[params.column.colDef.colId]) instanceof moment) {
                    return moment(params.node.data[params.column.colDef.colId]);
                }
            } else if (_.includes(arrayFields, params.column.colDef.colId)) {
                const values = [];
                params.value.split('|').forEach((val) => {
                    if (val !== '') {
                        values.push(_.trim(val));
                    }
                });
                return values;
            }
            if ((params.node.data[params.column.colDef.colId] === undefined || params.node.data[params.column.colDef.colId] === null) && params.value === '') {
                return params.node.data[params.column.colDef.colId];
            }
            return params.value;
        }
        return params.value;
    }
    /**
     *To handle grid pane save.
     */
    handleGridPaneSave = () => {}

    /**
     *To check the property of the cell.
     * @param {object} rowNode - row information.
     */
    isFullWidthCell = (rowNode) =>  {
        return rowNode.flower;
    }
    /**
     *To tell the grid if a particular row should expand or not .
     */
    doesDataFlower = () => {
        return true;
    }
    /**
     *To get the height of grid.
     */
    getRowHeight = (params) => {
        const rowIsDetailRow = params.node.flower;
        // return 500 when detail row, otherwise return 25
        return rowIsDetailRow ? 135 : 25;
    }
    /**
     *To get unique RowNode Id's.
     * @param {Object} data - contains row Data.
     */
    getRowNodeId = (data) => {
        return data.uniqueId ? data.uniqueId : data[this.props.linePlan.identifier];
    }
    /**
     *To get required text message in grid.
     */
    getLocateText = () => {
        const localeText = {
            rowGroupColumnsEmptyMessage: 'Drag a column header and drop it here to group by that column',
            noRowsToShow: 'Search criteria did not return with any results'
        };
        return localeText;
    }
    /**
     *To apply constious operations on grid.
     * @param {Object} data - contains row Data.
     */
    groupRowAggNodes = (params) => {
        const result = {};
        GROUP_AGG_CONTEXT[this.props.linePlan.name].forEach((element) => {
            result[element.field] = 0;
            params.forEach((param) => {
                if (param.aggData !== undefined && param.aggData[element.field] !== undefined) {
                    result[element.field] += param.aggData[element.field];
                }
            });
        });
        params.forEach((param) => {
            if (param.data !== undefined) {
                GROUP_AGG_CONTEXT[this.props.linePlan.name].forEach((element) => {
                    if (param.data[element.field] !== null && param.data[element.field] !== undefined) {
                        if (element.field === 'marketingName' || element.field === 'modelName') {
                            result[element.field] = params.length;
                        } else if (!isNaN(param.data[element.field])) {
                            result[element.field] += parseFloat(param.data[element.field]);
                        } else {
                            result[element.field] += 0;
                        }
                    } else if (this.props.linePlan.name === 'PRODUCT' && element.field === 'styleName') {
                        result[element.field] = params.length;
                    }
                });
            }
        });
        return result;
    }
    /**
     *To handle rows after creating it.
     * @param {Object} params - contains grid information.
     */
    processRowPostCreate = (params) => {
        if (params.eRow && this.props.linePlan.name !== 'COUNTRY' && this.props.linePlan.name !== 'CPO') {
            const draggableRows = [params.eRow, params.ePinnedLeftRow, params.ePinnedRightRow];
            draggableRows.forEach(($row) => {
                if (this.props.linePlan.name !== 'MODEL') {
                    $row.draggable = true;
                    $row.addEventListener('dragstart', (e) => {
                        const dataToTransfer = {};
                        if (params.node.selected) {
                            const rows = [];
                            for (const key in params.node.selectionController.selectedNodes) {
                                if (!params.node.selectionController.selectedNodes.hasOwnProperty(key)) continue;
                                const obj = params.node.selectionController.selectedNodes[key];
                                if (obj !== undefined) {
                                    rows.push(obj.data);
                                }
                            }
                            dataToTransfer.rows = _.cloneDeep(rows);
                            dataToTransfer.type = this.props.linePlan.shortenName;
                            dataToTransfer.linePlanName = this.props.linePlan.name;
                            dataToTransfer.pane = this.props.stateName;

                            const mainElement = document.createElement('div');
                            mainElement.id = 'draggableMouseElement';
                            mainElement.className = 'draggableMouseElement';

                            const draggingObjects = document.createElement('ul');
                            rows.forEach((row) => {
                                const object = document.createElement('li');
                                object.innerText = row[this.props.linePlan.identifier];
                                object.className = this.props.linePlan.className;
                                if (row.marketingName !== undefined) {
                                    object.innerText = (object.innerText ? object.innerText : '' ) + '\n' + row.marketingName;
                                }
                                draggingObjects.appendChild(object);
                            });

                            const messageElement = document.createElement('div');
                            const message = document.createElement('p');
                            message.innerText = rows.length + ' Lines(s).';
                            messageElement.appendChild(message);
                            messageElement.className = 'draggableMessage';
                            messageElement.id = 'draggableMessage';

                            mainElement.appendChild(draggingObjects);
                            mainElement.appendChild(messageElement);

                            document.body.appendChild(mainElement);
                        }
                        const isIE = /* @cc_on!@ */false || !!document.documentMode;
                        const isEdge = !isIE && !!window.StyleMedia;
                        let isSafari = false;
                        const ua = navigator.userAgent.toLowerCase();
                        if (ua.indexOf('safari') !== -1) {
                            if (ua.indexOf('chrome') > -1) {
                                isSafari = false; // Chrome
                            } else {
                                isSafari = true; // Safari
                            }
                        }
                        if (isIE || isEdge) {
                            const target = e.srcElement || e.target;
                            const cloneNode = target.cloneNode(true);
                            target.parentNode.insertBefore(cloneNode, target);
                            target.style.display = 'none';
                            window.setTimeout(() => {
                                target.parentNode.removeChild(cloneNode);
                                target.style.display = 'block';
                            }, 0);
                        } else {
                            if (!isSafari) {
                                e.dataTransfer.setDragImage(document.createElement('img'), 0, 0);
                            }
                        }
                        _DB.set('draggingFrom', this.props.stateName);
                        _DB.set('draggingObjects', dataToTransfer);
                        _DB.set('draggingObjectsIndexToRemove', []);
                        _DB.set('draggingTabs', this.props.tabDetails);
                    }, false);
                }
                $row.addEventListener('drag', (event) => {
                    if (params.node.selected) {
                        const mainElement = document.getElementById('draggableMouseElement');
                        if (mainElement) {
                            mainElement.style.left = (event.pageX + 10).toString() + 'px';
                            mainElement.style.top = (event.pageY + 10).toString() + 'px';
                            mainElement.style.zIndex = 999;
                            mainElement.style.display = 'block';
                        }
                    }
                });
                $row.addEventListener('dragend', () => {
                    params.api.clearRangeSelection();
                    document.body.click();
                    if (params.node.selected) {
                        if (document.getElementById('draggableMouseElement') !== undefined) {
                            const child = document.getElementById('draggableMouseElement');
                            child.parentNode.removeChild(child);
                            // document.getElementById('draggableMouseElement').remove();
                        }
                        _DB.remove('draggingObjects');
                        _DB.remove('draggingObjectsIndexToRemove');
                        _DB.remove('createObject');
                        _DB.remove('moveMO');
                        _DB.remove('selectedModel');
                        _DB.remove('draggingFrom');
                        // this.gridApi.deselectAll();
                    }
                });
                if (this.props.linePlan.name === 'MODEL') {
                    $row.addEventListener('dragover', () => {
                        params.node.setSelected(true);
                        _DB.set('selectedModel', params.node.data);
                    });
                    $row.addEventListener('dragleave', () => {
                        params.node.setSelected(false);
                    });
                    $row.addEventListener('drop', () => {
                        if (_DB.get('moveMO')) {
                            gridModals.openMoveMOModal(_DB.get('draggingObjects').rows, _DB.get('selectedModel'), this.props.stateName);
                        }
                    });
                }
            });
        }
    }
    /**
     *To handle with individual cells in grid.
     * @param {Object} e - event handler.
     */
    onDropInGrid = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const draggingObjects = _DB.get('draggingObjects');
        const draggingObjectsIndexToRemove = _DB.get('draggingObjectsIndexToRemove');
        if (draggingObjectsIndexToRemove.length > 0) {
            const newDraggingObjects = [];
            // draggingObjectsIndexToRemove.forEach((indexToRemove) => {
            draggingObjects.rows.forEach((row, index) => {
                let found = false;
                draggingObjectsIndexToRemove.forEach((indexToRemove, rowIndex) => {
                    if (index === indexToRemove) {
                        found = true;
                    }
                    if (!found && (rowIndex === draggingObjectsIndexToRemove.length - 1)) {
                        newDraggingObjects.push(row);
                    }
                });
            });
            // });
            draggingObjects.rows = newDraggingObjects;
        }
        if (draggingObjects !== undefined &&
            ((
                (this.props.linePlan.name === 'COUNTRY' && (draggingObjects.type === 'GMO' || draggingObjects.type === 'GPO')) ||
                (this.props.linePlan.name === 'CPO' && draggingObjects.type === 'GPO')
            ) ||
            (
                (this.props.linePlan.name === 'GEO' && (draggingObjects.type === 'MO' || draggingObjects.type === 'PO')) ||
                (this.props.linePlan.name === 'GPO' && draggingObjects.type === 'PO')
            ) ||
            (
                ((this.props.linePlan.name === 'GLOBAL' || this.props.linePlan.name === 'PO') && (draggingObjects.type === 'MO' || draggingObjects.type === 'PO') && _DB.get('draggingFrom') !== this.props.stateName)
            ))
            && _DB.get('createObject')) {
            // console.log(draggingObjects);
            // console.log(_DB.get('createObject'));
            if (this.props.linePlan.name === 'GLOBAL' || this.props.linePlan.name === 'PO') {
                if (draggingObjects.type === 'MO') {
                    gridModals.getChangeReasonAndComments((changeReason, note) => {
                        for (let i = 0; i < draggingObjects.rows.length; i++) {
                            const draggedMoId = draggingObjects.rows[i].moId;
                            draggingObjects.rows[i].changeReason = changeReason;
                            draggingObjects.rows[i].note = note;
                            draggingObjects.rows[i].moId = 'New_' + draggingObjects.rows[i].modelId + '_' + draggingObjects.rows[i].moId;
                            draggingObjects.rows[i].draggedMoId = draggedMoId;
                            draggingObjects.rows[i].id = null;
                            draggingObjects.rows[i].initialForecast = null;
                            draggingObjects.rows[i].initialAdoptionIntent = null;
                            draggingObjects.rows[i].newPOCount = 0;
                            draggingObjects.rows[i].carryoverPOCount = 0;
                            draggingObjects.rows[i].totalPOCount = 0;
                            draggingObjects.rows[i].seasonId = _lookups.getSeasonWithLabelAndDivision(this.props.searchData.season[0].value, draggingObjects.rows[i].divisionId).id;
                            draggingObjects.rows[i].confidentialTo = draggingObjects.rows[i].confidentialTo.map((CG) => {
                                return _privileges.isUserHasConfidentialAccess(CG) ? CG : null;
                            }).filter(d => d !== null);
                        }
                        this.props.addNewObjects(draggingObjects, this.props.gridData);
                    }, null);
                }
                if (draggingObjects.type === 'PO') {
                    const modalIds = _.uniq(draggingObjects.rows.map(d => d.modelId));
                    let filteredMOwithdraggedPOModelId =  [];
                    if (modalIds.length === 1) {
                        filteredMOwithdraggedPOModelId = this.state.rowData.filter((data) => data.modelId === modalIds[0]);
                    }
                    if (filteredMOwithdraggedPOModelId.length > 1) {
                        gridModals.openMOListModalToSelect(filteredMOwithdraggedPOModelId, (changeReason, note, selectedMOID) => {
                            for (let i = 0; i < draggingObjects.rows.length; i++) {
                                const draggedProductOfferingId = draggingObjects.rows[i].productOfferingId;
                                draggingObjects.rows[i].moId = selectedMOID;
                                draggingObjects.rows[i].changeReason = changeReason;
                                draggingObjects.rows[i].note = note;
                                draggingObjects.rows[i].productCOStatus = 'CARRYOVER';
                                draggingObjects.rows[i].id = null;
                                // draggingObjects.rows[i].marketingInitiativeIds = [];
                                draggingObjects.rows[i].specialOfferingTypeIds = [];
                                draggingObjects.rows[i].alternateMarketingTypeIds = [];
                                draggingObjects.rows[i].developmentTeamId = null;
                                draggingObjects.rows[i].seasonId = _lookups.getSeasonWithLabelAndDivision(this.props.searchData.season[0].value, draggingObjects.rows[i].divisionId).id;
                                draggingObjects.rows[i].productOfferingId = draggingObjects.rows[i].productId ? 'New_' + draggingObjects.rows[i].productId : 'New_' + i;
                                draggingObjects.rows[i].draggedProductOfferingId = draggedProductOfferingId;
                                draggingObjects.rows[i].earliestAllowedOfferDate = gridPaneUtils.getFirstOfferDate(this.props.searchData.season[0].value);
                            }
                            this.props.addNewObjects(draggingObjects, this.props.gridData);
                        });
                    } else {
                        const moId = (filteredMOwithdraggedPOModelId.length === 1) ? filteredMOwithdraggedPOModelId[0].moId : null;
                        gridModals.getChangeReasonAndComments((changeReason, note, selectedMOID) => {
                            for (let i = 0; i < draggingObjects.rows.length; i++) {
                                const draggedProductOfferingId = draggingObjects.rows[i].productOfferingId;
                                draggingObjects.rows[i].moId = (selectedMOID === null) ? 'New_' + draggingObjects.rows[i].modelId + '_' + draggingObjects.rows[i].moId : selectedMOID;
                                draggingObjects.rows[i].changeReason = changeReason;
                                draggingObjects.rows[i].note = note;
                                draggingObjects.rows[i].productCOStatus = 'CARRYOVER';
                                draggingObjects.rows[i].id = null;
                                // draggingObjects.rows[i].marketingInitiativeIds = [];
                                draggingObjects.rows[i].specialOfferingTypeIds = [];
                                draggingObjects.rows[i].alternateMarketingTypeIds = [];
                                draggingObjects.rows[i].developmentTeamId = null;
                                draggingObjects.rows[i].seasonId = _lookups.getSeasonWithLabelAndDivision(this.props.searchData.season[0].value, draggingObjects.rows[i].divisionId).id;
                                draggingObjects.rows[i].productOfferingId = draggingObjects.rows[i].productId ? 'New_' + draggingObjects.rows[i].productId : 'New_' + i;
                                draggingObjects.rows[i].draggedProductOfferingId = draggedProductOfferingId;
                                draggingObjects.rows[i].earliestAllowedOfferDate = gridPaneUtils.getFirstOfferDate(this.props.searchData.season[0].value);
                            }
                            this.props.addNewObjects(draggingObjects, this.props.gridData);
                        }, moId);
                    }
                }
            } else {
                this.props.addNewObjects(draggingObjects, this.props.gridData);
            }
        }
    }
    /**
     *To load the components in the modal.
     */
    render = () => {
        let closeLink = null;
        if (this.props.panes.length > 1) {
            closeLink = <span className="closePaneLink glyphicon glyphicon-remove" title="Close Pane" onClick={this.props.closePane} />;
        }
        let showSearchPaneButton = null;
        if (!this.props.splitterView) {
            showSearchPaneButton = <div onClick={this.props.showHideSearchPane} className="showHideSearchPaneButton fa fa-bars pull-left" />;
        }
        let gridPaneTitleClass = 'gridSectionLinePlanTitle pull-left';
        let linePlanLabel = null;
        if (this.props.linePlan !== '') {
            gridPaneTitleClass += ' ' + this.props.linePlan.className;
            if (!this.props.splitterView) {
                gridPaneTitleClass += ' showHideHamberger';
            }
            linePlanLabel = this.props.linePlan.displayLabel;
        }
        let PPTPaneView = null;
        let splitter = null;
        const gridViewClass = ['ag-fresh', 'gridContainer'];
        let editGridIconObj = {
            className: 'icon editGrid',
            title: 'Switch to Edit Mode'
        };
        if (this.state.editGrid) {
            gridViewClass.push('editable');
            editGridIconObj = {
                className: 'icon grid',
                title: 'Switch to Read Only Mode'
            };
        }
        if (!this.state.showNoResultsMsg) {
            gridViewClass.push('hideNoResultsMsg');
        }
        let editGridLink = <span className={editGridIconObj.className} title={editGridIconObj.title} onClick={this.handleGridEdit} />;
        if ((this.props.linePlan.name !== '' && !this.getUserAccessForEdit(this.props.linePlan.name))) {
            editGridIconObj.className = 'icon editGrid disabled';
            editGridLink = <span className={editGridIconObj.className} title={editGridIconObj.title} />;
        }
        let filterListContainer = null;
        const reflexContainerClass = ['subPane'];
        if (this.state.appliedFilters !== null && !_.isEmpty(this.state.appliedFilters)) {
            filterListContainer = <FiltersList appliedFilters={this.state.appliedFilters} removeFilter={this.removeFilter} columns={this.columnApi.getAllColumns()} />;
            reflexContainerClass.push('filterAdded');
        }
        let pptLink = (this.state.editGrid || !this.props.linePlan.PPT_Report) ? <span className="icon ppt disabled" title="Line Plan to PowerPoint" /> : <span className="icon ppt" onClick={this.togglePPTPane} title="Line Plan to PowerPoint" />;
        if (this.props.linePlan.name !== 'GLOBAL') {
            pptLink = null;
        }
        let cpoUploadLink = null;
        if (this.props.linePlan.name === 'CPO') {
            if (Privileges.getInstance().isUserHasAccessFor('CPO_UPDATE')) {
                cpoUploadLink = <span className="icon upload" onClick={() => {gridModals.openCPO_UploadModal.call(this);}} title="Upload CPO excel" />;
            } else {
                cpoUploadLink = <span className="icon upload disabled" title="Upload CPO excel" />;
            }
        }
        return (
            <div className="gridAndPPTReportView" >
                <div className="header">
                    {showSearchPaneButton}
                    <div className={gridPaneTitleClass}>{linePlanLabel}</div>
                    <div className={'gridPaneActionIcons ' + this.props.linePlan.className}>
                        {closeLink}
                    </div>
                    <div className="clearFix" />
                </div>
                <div className="content">
                    <div className="iconsSection">
                        <ul className="icons">
                            <li>{((this.props.isGridEdited || this.props.hasNewObjects) && this.checkForNoValidationErrors()) ? <span className="icon save" title="Save" onClick = {this.handleGridPaneSave}/> : <span className="icon save disabled" title="Save" />}</li>
                            <li>{pptLink}</li>
                            <li>{cpoUploadLink}</li>
                            {/* <li><span className="icon ppt disabled"  title="Line Plan to PowerPoint" /></li> */}
                        </ul>
                        <BreadCrumb linePlan={this.props.linePlan.name} searchData={this.props.searchData} />
                        <ul className="icons pull-right rightIcons">
                            <li><span className="icon gridSettingsRefresh" title="Restore Default Grid Settings" onClick={this.restoreDefaultConfirmation} /></li>
                            <li>{editGridLink}</li>
                        </ul>
                        <div className="clearfix" />
                    </div>
                    {filterListContainer}
                    <ReflexContainer className={reflexContainerClass.join(' ')} orientation="horizontal">
                        <ReflexElement minSize="0" >
                            <div className={gridViewClass.join(' ')} ref={(elem) => {/** Initialise gridContainerElm */this.gridContainerElm = elem;}}>
                                <AgGridReact
                                    // properties
                                    // columnDefs={this.state.columnDefs}
                                    suppressDragLeaveHidesColumns
                                    rowData={this.state.rowData}
                                    showToolPanel={false}
                                    onSortChanged={this.handleSortChange}
                                    onDragStopped={this.handleColumnDrag}
                                    onColumnResized={this.handleColumnResize}
                                    onColumnVisible={this.handleColumnVisible}
                                    onColumnPinned={this.saveGridStateToPreference}
                                    getContextMenuItems={this.getContextMenuItems}
                                    onRowDoubleClicked={this.openEditObjectModal}
                                    onColumnRowGroupChanged={this.saveGridStateToPreference}
                                    enableSorting
                                    enableColResize
                                    enableFilter
                                    groupUseEntireRow
                                    frameworkComponents={{groupRowInnerRenderer: GroupRowInnerRenderer}}
                                    groupRowInnerRenderer={'groupRowInnerRenderer'}
                                    groupRowRendererParams={
                                        {
                                            linePlan: this.props.linePlan
                                        }
                                    }
                                    groupRowAggNodes={this.groupRowAggNodes}
                                    rowGroupPanelShow={'always'}
                                    togglePPTPane={this.togglePPTPane}
                                    toolPanelSuppressPivotMode
                                    // events
                                    // onCellEditingStopped = {this.handleCellEditingStopped}
                                    onGridReady={this.onGridReady}
                                    isFullWidthCell={this.isFullWidthCell}
                                    fullWidthCellRendererFramework={RowExpanderContainer}
                                    onFilterChanged={this.setAppliedFilters}
                                    fullWidthCellRendererParams={
                                        {
                                            linePlan: this.props.linePlan,
                                            togglePPTPane: this.togglePPTPane,
                                            removeObjectInState: this.props.removeObjectInState,
                                            stateName: this.props.stateName,
                                            searchData: this.props.searchData,
                                            saveMassEdits: this.props.saveMassEdits,
                                            showPPTPaneView: this.state.showPPTPaneView,
                                            openNewPane: this.props.openNewPane,
                                            currentProfile: this.props.currentProfile
                                        }
                                    }
                                    doesDataFlower={this.doesDataFlower}
                                    getRowHeight={this.getRowHeight}
                                    // getRowNodeId={this.getRowNodeId}
                                    localeText={this.getLocateText()}
                                    rowSelection={(!this.state.editGrid) ? 'multiple' : ''}

                                    rowClassRules={{
                                        'inactiveData': function inactiveData(params) {
                                            return (params.data !== undefined && !params.data.active);
                                        }
                                    }}

                                    rowDeselection
                                    // enableCellChangeFlash
                                    processRowPostCreate={this.processRowPostCreate}
                                    processCellFromClipboard={this.processCellDataFromClipboardBeforeUpdate}
                                    onCellValueChanged = {this.state.editGrid && this.handleCellEditingStopped}
                                    onCellMouseOver={this.updateCellAltAttr}
                                    rememberGroupStateWhenNewData
                                    deltaRowDataMode
                                    getRowNodeId={this.getRowNodeId}
                                    stopEditingWhenGridLosesFocus
                                    enterMovesDownAfterEdit
                                    enableRangeSelection
                                    popupParent={document.querySelector('body')}
                                    onCellClicked={this.openObjectInNewPane}
                                    excelStyles={this.getCPOExcelStyles()}
                                    suppressColumnVirtualisation
                                />
                            </div>
                        </ReflexElement>
                        {splitter}
                        {PPTPaneView}
                    </ReflexContainer>
                </div>
            </div>
        );
    }
}

GridPane.propTypes = {
    panes: PropTypes.arrayOf(PropTypes.object).isRequired,
    stateName: PropTypes.string.isRequired,
    closePane: PropTypes.func.isRequired,
    showHideSearchPane: PropTypes.func.isRequired,
    splitterView: PropTypes.bool.isRequired,
    linePlan: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        displayLabel: PropTypes.string.isRequired,
        shortenDisplayLabel: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        className: PropTypes.string.isRequired
    }),
    updatePreference: PropTypes.func,
    saveEditedData: PropTypes.func.isRequired,
    setEditedData: PropTypes.func.isRequired,
    searchData: PropTypes.object,
    hideLoader: PropTypes.func,
    showLoader: PropTypes.func,
    removeObjectInState: PropTypes.func,
    hasNewObjects: PropTypes.bool,
    isGridEdited: PropTypes.bool,
    saveNewObjects: PropTypes.func,
    searchStarted: PropTypes.bool,
    openNewPane: PropTypes.func,
    createAsianVersion: PropTypes.func,
    shareColorway: PropTypes.func
};
