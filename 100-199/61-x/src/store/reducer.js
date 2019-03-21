import * as actionTypes from './actionTypes';
import { masterDetail, tabDetails } from '../gridData';
import uuidv4 from 'uuid';

const initialState = {
    rowData: null,
}

const initRowData = (prevState) => ({
    ...prevState,
    rowData: masterDetail.map(row => ({
        ...row,
        id: uuidv4(),
        detail: {
            gridTab1: {
                sortModel: [],
                filterModel: {},
                data: tabDetails[row.mainCol1].gridTab1Data.map(d => ({ ...d, id: uuidv4() }))
            },
            nonGridTab: {
                ...tabDetails[row.mainCol1].nonGridTabData
            },
            gridTab2: {
                sortModel: [],
                filterModel: {},
                data: tabDetails[row.mainCol1].gridTab2Data.map(d => ({ ...d, id: uuidv4() }))
            }
        }
    }))
})

const setSortModel = (prevState, action) => ({
    ...prevState,
    rowData: prevState.rowData.map((row, ind) => ({
        ...row,
        detail: {
            gridTab1: {
                ...row.detail.gridTab1,
                sortModel: action.rowIndex === ind && action.tab === 'gridTab1' ? action.sortModel : row.detail.gridTab1.sortModel.map(s => ({ ...s })),
                filterModel: { ...row.detail.gridTab1.filterModel },
                data: row.detail.gridTab1.data.map(d => ({ ...d }))
            },
            nonGridTab: {
                ...row.detail.nonGridTab
            },
            gridTab2: {
                ...row.detail.gridTab2,
                sortModel: action.rowIndex === ind && action.tab === 'gridTab2' ? action.sortModel : row.detail.gridTab2.sortModel.map(s => ({ ...s })),
                filterModel: { ...row.detail.gridTab2.filterModel },
                data: row.detail.gridTab2.data.map(d => ({ ...d }))
            },
        }
    }))
});

const setFilterModel = (prevState, action) => ({
    ...prevState,
    rowData: prevState.rowData.map((row, ind) => ({
        ...row,
        detail: {
            gridTab1: {
                ...row.detail.gridTab1,
                sortModel: row.detail.gridTab1.sortModel.map(s => ({ ...s })),
                filterModel: action.rowIndex === ind && action.tab === 'gridTab1' ? action.filterModel : { ...row.detail.gridTab1.filterModel },
                data: row.detail.gridTab1.data.map(d => ({ ...d }))
            },
            nonGridTab: {
                ...row.detail.nonGridTab
            },
            gridTab2: {
                ...row.detail.gridTab2,
                sortModel: row.detail.gridTab2.sortModel.map(s => ({ ...s })),
                filterModel: action.rowIndex === ind && action.tab === 'gridTab2' ? action.filterModel : { ...row.detail.gridTab2.filterModel },
                data: row.detail.gridTab2.data.map(d => ({ ...d }))
            },
        }
    }))
});


const reducer = (prevState = initialState, action) => {
    switch (action.type) {
        case actionTypes.INIT_ROW_DATA: return initRowData(prevState, action);
        case actionTypes.SET_SORT_MODEL: return setSortModel(prevState, action);
        case actionTypes.SET_FILTER_MODEL: return setFilterModel(prevState, action)
        default: return prevState;
    }
}

export default reducer