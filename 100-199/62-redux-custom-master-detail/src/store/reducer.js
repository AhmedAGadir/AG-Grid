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
                data: tabDetails[row.mainCol1].gridTab1Data.map(d => ({ ...d, id: uuidv4() }))
            },
            nonGridTab: {
                ...tabDetails[row.mainCol1].nonGridTabData
            },
            gridTab2: {
                data: tabDetails[row.mainCol1].gridTab2Data.map(d => ({ ...d, id: uuidv4() }))
            }
        }
    }))
})

const reducer = (prevState = initialState, action) => {
    switch (action.type) {
        case actionTypes.INIT_ROW_DATA: return initRowData(prevState, action);
        default: return prevState;
    }
}

export default reducer