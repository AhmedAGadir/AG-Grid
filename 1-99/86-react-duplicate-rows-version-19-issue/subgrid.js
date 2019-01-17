import React from 'react';
import PropTypes from 'prop-types';
import { AgGridReact } from 'ag-grid-react';
import { SUBGRID_COLUMNS } from '../../../../../config/gridConfig/subGridColumnConfig';
import UserPreferenceService from '../../../../../services/userPreferenceService';
import { SUBGRID_NONEDITABLE_FIELDS } from '../../../../../constants/editableFieldConstants';
import { SUBGRID_CONTEXT_MENUS } from '../../../../../constants/subGridContextMenus';
import MessageService, { messageTypes } from '../../../../../services/messagingService';
import Privileges from '../../../../../services/privilegesService';
import History from '../History';
import moment from 'moment';
import DB from '../../../../../services/DBService';
import { gridPaneUtils } from '../../../utils/gridPaneUtils';
import _ from 'lodash';
import { gridModals } from '../../../gridModals';
import { SUBGRID_TABS } from '../../../../../constants/SubGridConstants';
import { contextMenuActions } from '../../../contextMenuActions';

let _userPreferenceService;
/**
 * Sets message service instance
 */
const _MessageService = MessageService.getInstance();
/**
 * Sets database instance
 */
const _DB = DB.getInstance();
let _privileges;
/**
 * This component is SubGrid.
 * @example
 *   <subGrid
 *       tabDatas={this.props.tabDatas}
 *       activeTab={this.props.activeTab}
 *       identifier={this.props.identifier}
 *       selectedObject={this.props.selectedObject}
 *       tab={this.props.tab}
 *       allTabData={this.props.allTabData}
 *       rowNode={this.props.rowNode}
 *       searchData={this.props.searchData}
 *       preference={this.props.preference}
 *       stateName={this.props.stateName}
 *       entitySearch={this.props.entitySearch}
 *       data={this.props.data}
 *   />
 */
export default class subGrid extends React.Component {
  /**
         * creates a instance of subGrid.
         * @param selectedObject - Selected Row to expand
         * @param tabDatas - data regarding the tabs
         * @param activeTab - selected Tab
         * @param tab  - Method to call api for Save edits
         * @param allTabData - information about each tab
         * @param identifier - unique information pretaining to a tab
         * @param rowNode - Object row
         * @param searchData - Search criteria
         * @param preference - preferred user data
         * @param stateName - pane information
         * @param entitySearch - parameters for API Call
         * @param data - data in subgrid
         */
  constructor(props) {
    super(props);
    /**
         * @type {object}
         * @property {Object} rowDatas - has the row information
         * @property {Array} columnDefs - has the details of columns in the SubGrid
         * @property {object} restoreDefault -to restore the default settings
         * @property {string} entityName - has the entity name
         * @property {Array} ids - has the id's
         */
    this.state = {
      columnDefs: [],
      rowDatas: [],
      restoreDefault: false,
      entityName: '',
      ids: []
    };
  }
  /**
   *Invoked before component is rendered.
   */
  componentDidMount = () => {
    if (this.props.linePlan.name === 'STYLE') {
      const rows = _.sortBy(this.props.tabDatas.productOfferings, [updatedDatas => updatedDatas.productOfferingId]);
      if (rows !== undefined && rows !== null && rows.length > 0 && this.props.activeTab.type === this.props.tab.type) {
        let rowHeight = 80;
        const subGridRowHeight = 25;
        if (rows.length <= 25 && rows.length > 1) {
          rowHeight += ((rows.length) * subGridRowHeight);
        }
        if (rows.length === 1) {
          rowHeight = 105;
        }
        if (rows.length > 25) {
          rowHeight += (25 * subGridRowHeight);
        }
        setTimeout(() => {
          if (this.props.rowNode.detailNode) {
            this.props.rowNode.detailNode.setRowHeight(rowHeight);
          } else {
            this.props.rowNode.setRowHeight(rowHeight);
          }
          this.props.gridApi.onRowHeightChanged();
        }, 500);
      }
      this.setState({ rowDatas: rows, showLoader: false });
    }
  }
  /**
   *Invoked when component recieves a new props.
   */
  componentWillReceiveProps(nextProps) {
    this.setUserPreferenceToComponent(nextProps);
    if ((this.props.selectedObject !== nextProps.selectedObject && nextProps.selectedObject !== null && nextProps.activeTab.key === nextProps.tab.key)
      || (this.props.tabDatas !== nextProps.tabDatas && nextProps.activeTab.key === nextProps.tab.key)
      || this.props.allTabData !== nextProps.allTabData
      || this.props.identifier !== nextProps.identifier
      || nextProps.activeTab !== this.props.activeTab) {
      let rows;
      let resultsNotFound = true;
      switch (nextProps.tab.key) {
        case 'CPO':
          rows = _.sortBy(this.formatCountryProductOfferings(nextProps.tabDatas.countryProductOfferings), [updatedDatas => updatedDatas.cpoId]);
          // rows = nextProps.tabDatas.countryProductOfferings;
          if (nextProps.tabDatas.countryProductOfferings) {
            resultsNotFound = false;
          }
          break;
        default:
          rows = [];
      }
      if (rows !== undefined && rows !== null && rows.length > 0 && this.props.activeTab.type === this.props.tab.type) {
        let rowHeight = 135;
        let subGridRowHeight = 25;
        if (this.props.tab.type === 'history') {
          rowHeight = 164;
        }
        if (this.props.linePlan.name === 'APPROVE_COLORS') {
          // rowHeight = (nextProps.tabDatas.unlinkedImages !== undefined && nextProps.tabDatas.unlinkedImages.length > 0) ? 267 : 187;
          rowHeight = 187;
          subGridRowHeight = 50;
        }
        if (this.props.linePlan.name === 'STYLE') {
          rowHeight = 80;
          if (rows.length === 1) {
            rowHeight = 105;
          }
        }
        if (rows.length <= 25 && rows.length > 1 && this.props.linePlan.name !== 'APPROVE_COLORS') {
          rowHeight += ((rows.length - 1) * subGridRowHeight);
        }
        setTimeout(() => {
          if (this.props.rowNode.detailNode) {
            this.props.rowNode.detailNode.setRowHeight(rowHeight);
          } else {
            this.props.rowNode.setRowHeight(rowHeight);
          }
          this.props.gridApi.onRowHeightChanged();
        }, 1);
      }
      this.setState({ rowDatas: rows, showLoader: resultsNotFound }, () => {
        if (this.gridApi) {
          this.gridApi.setRowData(this.state.rowDatas);
          let selectedRows = [];
          if (this.gridApi.getSelectedNodes().length > 0) {
            selectedRows = this.gridApi.getSelectedNodes();
          }
          // this.gridApi.refreshCells();
          this.highlightNewObjectRow(nextProps, selectedRows);
          this.setGridColumnDefinition();
          if (this.props.tab.type === 'history') {
            this.autoResize();
          }
        }
      });
    }
  }
  /**
   *invokes automatically which is a lifecycle method.
   */
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.activeTab !== nextProps.activeTab) {
      return true;
    }
    if (nextState.restoreDefault) {
      return true;
    }
    if (this.props.tabDatas !== nextProps.tabDatas) {
      return true;
    }
    if (this.props.allTabData !== nextProps.allTabData) {
      return true;
    }
    if (this.state.columnDefs !== nextState.columnDefs && this.state.columnDefs.length !== 0 && this.props.linePlan.name === nextProps.linePlan.name) {
      return false;
    }
    return true;
  }
  /**
   *Invoked before component is rendered.
   */
  componentWillUnmount = () => {
    if (this.gridApi !== undefined && this.gridApi.rowModel.rowsToDisplay.length > 0 && this.props.tab.key === 'GPO') {
      this.gridApi.rowModel.rowsToDisplay.forEach((row) => {
        row.removeEventListener('dragstart');
        row.removeEventListener('drag');
        row.removeEventListener('dragend');
      });
    }
    this.gridContainerElm.removeEventListener('keydown', this.onKeyDown);
  }
  /**
   *To highlight a new Object.
   * @param {object} props -  prop details.
   */
  highlightNewObjectRow = (props, selectedRows = []) => {
    if (this.gridApi) {
      this.gridApi.forEachNode((node) => {
        if (props.selectedObject === node.data[props.activeTab.identifier]) {
          node.setSelected(true);
        } else if (props.tab.identifier !== null && node.data !== undefined && node.data[props.tab.identifier] !== undefined && node.data[this.props.tab.identifier].toString().substring(0, 3).toLowerCase() === 'new') {
          node.setSelected(true);
        } else if (selectedRows && selectedRows.length > 0) {
          selectedRows.forEach((row) => {
            if (node.childIndex === row.childIndex) {
              node.setSelected(true);
            }
          });
        } else {
          node.setSelected(false);
        }
      });
    }
  }
  /**
   *To load the SubGrid with columns and data.
   * @param {string} params - SubGrid API's.
   */
  onGridReady = (params) => {
    /**
       * Sets the grid api
       */
    this.gridApi = params.api;
    /**
       * Sets the grid column api
       */
    this.columnApi = params.columnApi;
    this.gridApi.setRowData([]);
    if (this.gridContainerElm !== null && this.gridContainerElm !== undefined) {
      this.gridContainerElm.addEventListener('keydown', this.onKeyDown);
    }
    this.gridApi.hideOverlay();
    this.setGridColumnDefinition();
    this.gridApi.setRowData(this.state.rowDatas);
    this.gridApi.refreshCells();
    this.highlightNewObjectRow(this.props);
  }
  /**
   *To set the SubGrid Column definition.
   */
  setGridColumnDefinition = () => {
    const gridColumnData = this.state.columnDefs.slice();
    for (let i = 0; i < gridColumnData.length; i++) {
      if (gridColumnData[i] !== undefined) {
        gridColumnData[i].menuTabs = ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'];
        if (gridColumnData[i].colId === 'image') {
          gridColumnData[i].suppressMenu = false;
          gridColumnData[i].suppressFilter = true;
        }
        if (SUBGRID_NONEDITABLE_FIELDS[this.props.linePlan.name][this.props.tab.key][gridColumnData[i].field] !== undefined) {
          gridColumnData[i] = Object.assign(gridColumnData[i], SUBGRID_NONEDITABLE_FIELDS[this.props.linePlan.name][this.props.tab.key][gridColumnData[i].field]);
          if (this.props.linePlan.name === 'APPROVE_COLORS') {
            if (['primaryImage', 'secondaryImage', 'tertiaryImage'].indexOf(gridColumnData[i].field) !== -1) {
              gridColumnData[i].cellRendererParams.moveImageLinkFromUnlink = this.props.moveImageLinkFromUnlink;
              gridColumnData[i].cellRendererParams.moveImageBtwProducts = this.props.moveImageBtwProducts;
            }
          }
        }
      }
    }
    if (this.props.linePlan.name === 'APPROVE_COLORS') {
      if (this.props.data.divisionId === 2) { // checking for footwear division
        const secondaryImageIndex = gridColumnData.findIndex((col) => col.field === 'secondaryImage');
        gridColumnData.splice(secondaryImageIndex, 1);
        const tertiaryImageIndex = gridColumnData.findIndex((col) => col.field === 'tertiaryImage');
        gridColumnData.splice(tertiaryImageIndex, 1);
      } else {
        const bomVersionIndex = gridColumnData.findIndex((col) => col.field === 'bomColorDescription');
        gridColumnData.splice(bomVersionIndex, 1);
      }
    }
    this.gridApi.setColumnDefs(gridColumnData);
  }
  /**
   *To handle the user preference.
   */
  handleSortChange = () => {
    this.saveGridStateToPreference();
  }
  /**
   *To resize the columns.
   */
  autoResize = () => {
    const columnIds = [];
    this.columnApi.getAllColumns().forEach((column) => {
      columnIds.push(column.colId);
    });
    this.columnApi.autoSizeColumns(columnIds);
  }
  /**
   *To remove a row from SubGrid.
   */
  removeNewRow = (params) => {
    this.props.removeNewRow(this.props.tab, params.node.data[this.props.tab.identifier], params.node.data[this.props.linePlan.identifier]);
  }
  /**
   *To load the SubGrid with columns and data.
   * @param {Array} rows - SubGrid data
   * @param {string} screen - Screen to open
   * @param {string} editingEntity - Field edited.
   */
  editSizeRange = (rows, screen, editingEntity) => {
    const rowsWithSizeScale = _.filter(rows, (row) => {
      if (editingEntity !== 'Product') {
        return !!row.sizeScale;
      } else if (row.style && row.style.sizeScale) {
        return !!row.style.sizeScale.id;
      }
      return false;
    });
    const openSizes = () => {
      gridModals.openMassSizeEditModal(rowsWithSizeScale, screen, editingEntity, this.props.stateName, this.props.saveMassEdits, false, false, this.props.identifier);
    };
    if (gridPaneUtils.checkForNewRows(rows, this.props.tab.identifier)) {
      _MessageService.showMessageBox(messageTypes.ALERT, 'Save', 'You must save object before you can edit it.');
    } else if (rowsWithSizeScale.length === 0) {
      _MessageService.showMessageBox(messageTypes.ALERT, 'Multi Edit size', `All of the selected ${editingEntity}s do not have Style Number assigned. Please reselect ${editingEntity}s that have Style Number assigned.`);
    } else if (rowsWithSizeScale.length !== rows.length) {
      const screenText = screen === 'retail' ? 'Retail/Promo Sizes Screen' : 'Sample Size Screen';
      _MessageService.showMessageBox(messageTypes.ALERT, 'Multi Edit size',
        `Some of the selected ${editingEntity}s do not have Style Number assigned.
            They will not be included in the Mass Edit ${screenText} `,
        () => {
          setTimeout(openSizes, 100);
        });
    } else {
      openSizes();
    }
  }
  /**
   *To get the context menus.
   * @param {object} params - SubGrid details
   */
  getContextMenuItems = (params) => {
    let subGridContextMenu = null;
    const rows = [];
    if (params.node !== undefined && params.node !== null && params.node.selected) {
      for (const key in params.node.selectionController.selectedNodes) {
        if (!params.node.selectionController.selectedNodes.hasOwnProperty(key)) { continue; }
        const obj = params.node.selectionController.selectedNodes[key];
        if (obj !== undefined) {
          rows.push(obj.data);
        }
      }
    }
    if (params.node !== undefined && params.node !== null) {
      if (rows.length > 0) {
        subGridContextMenu = [];
        const contextMenuConfig = SUBGRID_CONTEXT_MENUS[this.props.linePlan.name];
        if (contextMenuConfig) {
          const tabContextMenu = contextMenuConfig[this.props.tab.key];
          if (tabContextMenu) {
            if (params.node.selected && rows.length === 1) {
              subGridContextMenu = tabContextMenu.NORMAL ? tabContextMenu.NORMAL : [];
            } else {
              subGridContextMenu = tabContextMenu.SELECTED ? tabContextMenu.SELECTED : [];
            }
          }
        }
      } else {
        return null;
      }
      subGridContextMenu.map((menuItem) => {
        if (menuItem) {
          switch (menuItem.key) {
            case 'MOVE_NEW_PO':
              menuItem.action = () => gridPaneUtils.validateAndLaunchMoveNewPOModal(rows, this.props.stateName, this.props.showLoader, true);
              menuItem.disabled = gridPaneUtils.isDisableMoveNewPO(rows);
              break;
          }
          if (menuItem.subMenu) {
            menuItem.subMenu.map((subMenuItem) => {
              switch (subMenuItem.key) {
                case 'COUNTRY_LPTOPPT_NORMAL':
                  subMenuItem.action = this.togglePPTPane;
                  break;
              }
            });
          }
        }
      });
    }
    return subGridContextMenu;
  }
  /**
   *To export Subgrid data.
   * @param {object} params - SubGrid data
   */
  exportGrid = (params) => {
    this.gridApi.exportDataAsCsv(params);
  };
  /**
   *To export Subgrid data.
   */
  togglePPTPane = () => {
    this.props.togglePPTPane();
  }
  /**
   *To restore the default grid settings.
   */
  restoreDefault = () => {
    this.setState({ restoreDefault: true }, () => {
      const preference = _userPreferenceService.setPreferenceData(this.props.preference);
      if (preference.gridPreferences === undefined) {
        preference.gridPreferences = {};
        preference.gridPreferences[this.props.linePlan.name] = {};
      } else if (preference.gridPreferences[this.props.linePlan.name] === undefined) {
        preference.gridPreferences[this.props.linePlan.name] = {};
      }
      const data = preference.gridPreferences[this.props.linePlan.name];
      const field = `subGrid_${this.props.tab.key}`;
      data[field] = SUBGRID_COLUMNS[this.props.linePlan.name][this.props.tab.key].slice();
      this.props.updatePreference(_userPreferenceService.getUpdatePreferenceSeriveParamas(data, 6, this.props.linePlan.name));
    });
  }
  /**
   *To invoke onKey down.
   * @param {Object} e - event handler.
   */
  onKeyDown = (e) => {
    const params = {};
    const currentCell = this.gridApi.getFocusedCell();
    const rowIndex = currentCell.rowIndex;
    const rowNode = this.gridApi.getDisplayedRowAtIndex(rowIndex);
    params.node = rowNode;
    params.data = rowNode.data;
    if (e.key === 'Enter' && params.data !== undefined) {
      this.openEditObjectModal(params);
    }
    if (e.ctrlKey && (e.keyCode === 65 || e.keyCode === 97)) {
      this.gridApi.selectAll();
    }
  }
  /**
   *To open the edit object modal.
   * @param {Object} params - contains subgrid information.
   */
  openEditObjectModal = (params) => {
    if (this.props.linePlan.name !== 'STYLE' && params.data !== undefined && (this.props.tab.key === 'CPO' || this.props.tab.key === 'GPO' || this.props.tab.key === 'Product' || this.props.tab.key === 'PO' || this.props.tab.key === 'MO')) {
      if (params.data[this.props.tab.identifier].toString().substring(0, 3).toLowerCase() === 'new') {
        _MessageService.showMessageBox(messageTypes.ALERT, 'Save', 'You must save this object before you can edit it.');
      } else if (this.props.tab.name === 'CPO') {
        gridModals.openEditCPOModal(params, this.props.stateName, this.props.tab.identifier, false);
      }
      {
        const approveColorsObjs = this.props.getApproveColorsObjs();
        let rowEditedIndex = -1;
        approveColorsObjs.forEach((data) => {
          rowEditedIndex = data.imagesToUnlink.findIndex((img) => params.data.colorwayId !== undefined && img.colorway.bizIdentifier === params.data.colorwayId);
          if (rowEditedIndex === -1 && data.products.length > 0) {
            rowEditedIndex = data.products.findIndex((prd) => params.data.productId !== undefined && prd.productId === params.data.productId);
          }
        });
        if (rowEditedIndex !== -1) {
          _MessageService.showMessageBox(messageTypes.ALERT, 'Save', 'You must save this object before you can edit it.');
        } else {
          gridModals.openEditPOModal(params, this.props.stateName, this.props.tab.identifier, false);
        }
      }
    } else if (params.data !== undefined && this.props.tab.key === 'MO') {
      gridModals.openCreateEditMOModal(params, this.props.stateName, this.props.tab.identifier, 'edit', null, false);
    }
  }
}
/**
 *To get unique RowNode Id's.
 * @param {Object} data - contains row Data.
 */
getRowNodeId = (data) => {
  return data.uniqueId ? data.uniqueId : data[this.props.tab.identifier];
}
/**
 *To handle rows after creating it.
 * @param {Object} params - contains grid information.
 */
processRowPostCreate = (params) => {
  if (params.eRow && ((this.props.tab.key === 'GPO' && this.props.linePlan.name === 'GEO') || (this.props.tab.key === 'PO' && this.props.linePlan.name === 'GLOBAL') || (this.props.tab.key === 'MO' && this.props.linePlan.name === 'MODEL'))) {
    const draggableRows = [params.eRow, params.ePinnedLeftRow, params.ePinnedRightRow];
    draggableRows.forEach(($row) => {
      $row.draggable = true;
      $row.addEventListener('dragstart', (e) => {
        const dataToTransfer = {};
        if (params.node.selected) {
          const rows = [];
          for (const key in params.node.selectionController.selectedNodes) {
            if (!params.node.selectionController.selectedNodes.hasOwnProperty(key)) { continue; }
            const obj = params.node.selectionController.selectedNodes[key];
            if (obj !== undefined) {
              rows.push(obj.data);
            }
          }
          dataToTransfer.rows = _.cloneDeep(rows);
          dataToTransfer.type = this.props.tab.key;
          dataToTransfer.linePlanName = this.props.linePlan.name;
          dataToTransfer.pane = this.props.stateName;
          const mainElement = document.createElement('div');
          mainElement.id = 'draggableMouseElement';
          mainElement.className = 'draggableMouseElement';

          const draggingObjects = document.createElement('ul');
          rows.forEach((row) => {
            const object = document.createElement('li');
            object.innerText = row[this.props.tab.identifier];
            object.className = this.props.linePlan.className;
            // if (row.marketingName !== undefined) {
            //     object.innerText = (object.innerText ? object.innerText : '' )  + '\n' + row.marketingName;
            // }
            object.innerText = (object.innerText ? object.innerText : '');
            draggingObjects.appendChild(object);
          });

          const messageElement = document.createElement('div');
          const message = document.createElement('p');
          message.innerText = `${rows.length} Lines(s).`;
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
        } else if (!isSafari) {
          e.dataTransfer.setDragImage(document.createElement('img'), 0, 0);
        }
        _DB.set('draggingFrom', this.props.stateName);
        _DB.set('draggingObjects', dataToTransfer);
        _DB.set('draggingObjectsIndexToRemove', []);
      }, false);
      $row.addEventListener('drag', (event) => {
        if (params.node.selected) {
          const mainElement = document.getElementById('draggableMouseElement');
          if (mainElement) {
            mainElement.style.left = `${(event.pageX + 10).toString()}px`;
            mainElement.style.top = `${(event.pageY + 10).toString()}px`;
            mainElement.style.zIndex = 999;
            mainElement.style.display = 'block';
          }
        }
      });
      $row.addEventListener('dragend', () => {
        if (params.node.selected) {
          if (document.getElementById('draggableMouseElement') !== undefined) {
            const child = document.getElementById('draggableMouseElement');
            child.parentNode.removeChild(child);
          }
          _DB.remove('draggingObjects');
          _DB.remove('draggingObjectsIndexToRemove');
          _DB.remove('createObject');
          _DB.remove('moveMO');
          _DB.remove('selectedModel');
          _DB.remove('draggingFrom');
          this.gridApi.deselectAll();
        }
      });
    });
  }
}
/**
 *To load the components in the modal.
 */
render() {
  let className = 'ag-fresh gridContainer tabGrid';
  const historyTab = this.props.tab.key === 'History';
  let restoreDefault = <span className="icon gridSettingsRefresh" title="Restore Default Grid Settings" onClick={this.restoreDefault} />;
  if (this.props.linePlan.name === 'APPROVE_COLORS') {
    restoreDefault = <span className="icon gridSettingsRefresh forApproveColors" title="Restore Default Grid Settings" onClick={this.restoreDefault} />;
    className += ' approveColorsPOSubGrid';
    if (this.props.tabDatas.unlinkedImages !== undefined && this.props.tabDatas.unlinkedImages.length > 0) {
      className += ' hasUnlinkedImages';
    }
  }
  if (this.props.linePlan.name === 'STYLE') {
    restoreDefault = null;
  }
  return (
    <div className={(historyTab) ? `${className} historyTabGrid` : className} ref={(elem) => {
/** Sets the grid container reference*/ this.gridContainerElm = elem;
    }}>
      {restoreDefault}
      {historyTab ? <History allTabData={this.props.allTabData} entitySearch={(entityName) => {
        this.props.entitySearch(entityName); this.setState({ callForHistoryID: true });
      }} linePlan={this.props.linePlan} clearHistoryData={() => {
        this.clearHistoryData();
      }} getHistoryData={(entityType, entitySK) => {
        this.setState({ showLoader: true, callForHistoryID: false }, this.props.getHistoryData(entityType, entitySK));
      }} rowData={this.props.data} /> : null}
      <div className="subGrid" >
        <AgGridReact
          // properties
          columnDefs={this.state.columnDefs}
          rowData={this.state.rowDatas}
          getContextMenuItems={this.getContextMenuItems}
          showToolPanel={false}
          enableSorting
          enableColResize
          enableFilter
          rowGroupPanelShow={historyTab ? 'never' : 'always'}
          onGridReady={this.onGridReady}
          onSortChanged={this.handleSortChange}
          onDragStopped={this.saveGridStateToPreference}
          onColumnResized={this.saveGridStateToPreference}
          onColumnVisible={this.saveGridStateToPreference}
          onColumnPinned={this.saveGridStateToPreference}
          onColumnRowGroupChanged={this.saveGridStateToPreference}
          onRowDoubleClicked={this.openEditObjectModal}
          getRowHeight={this.getRowHeight}
          rowSelection="multiple"
          rowClassRules={{
            inactiveData: function inactiveData(params) {
              return (params.data !== undefined && params.data.active !== undefined && !params.data.active);
            }
          }}
          rowDeselection
          groupUseEntireRow
          processRowPostCreate={this.processRowPostCreate}
          rememberGroupStateWhenNewData
          deltaRowDataMode
          getRowNodeId={this.getRowNodeId}
          popupParent={document.querySelector('body')}
          onCellClicked={this.handleTabClicked}
        />
      </div>
    </div>
  );
}
}

subGrid.propTypes = {
  selectedObject: PropTypes.any,
  tab: PropTypes.object,
  allTabData: PropTypes.object,
  entitySearch: PropTypes.func,
  tabDatas: PropTypes.object,
  linePlan: PropTypes.object,
  preference: PropTypes.object,
  updatePreference: PropTypes.func,
  togglePPTPane: PropTypes.func,
  showLoader: PropTypes.func,
  stateName: PropTypes.string.isRequired,
  getHistoryData: PropTypes.func,
  identifier: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  removeNewRow: PropTypes.func,
  saveMassEdits: PropTypes.func,
  searchData: PropTypes.object,
  mainGridData: PropTypes.array,
  rowNode: PropTypes.object,
  gridApi: PropTypes.object,
  activeTab: PropTypes.object,
  data: PropTypes.object,
  tabClick: PropTypes.func,
  moveImageLinkFromUnlink: PropTypes.func,
  moveImageBtwProducts: PropTypes.func,
  openNewPane: PropTypes.func,
  getApproveColorsObjs: PropTypes.func,
  createAsianVersion: PropTypes.func,
  shareColorway: PropTypes.func,
  currentProfile: PropTypes.object
};
