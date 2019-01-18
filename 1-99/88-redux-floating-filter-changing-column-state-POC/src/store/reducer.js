import * as actionTypes from './actionTypes';

const initialState = {
    isFilterVisible: true,
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete' },
        { headerName: 'Sport', field: 'sport' },
        { headerName: 'Age', field: 'age' },
        { headerName: 'Year', field: 'year' },
        { headerName: 'Date', field: 'date' },
        { headerName: 'Gold', field: 'gold' },
        { headerName: 'Silver', field: 'silver' },
        { headerName: 'Bronze', field: 'bronze' }
    ],
    rowData: null,
}

const reducer = (prevState = initialState, action) => {
    switch (action.type) {
        case actionTypes.INIT_ROW_DATA:
            return {
                ...prevState,
                columnDefs: prevState.columnDefs.map(colDef => ({ ...colDef })),
                rowData: action.rowData,
            };
        case actionTypes.TOGGLE_FLOATING_FILTER:
            return {
                ...prevState,
                isFilterVisible: !prevState.isFilterVisible,
                columnDefs: prevState.columnDefs.map(colDef => ({ ...colDef })),
                rowData: prevState.rowData.map(row => ({ ...row })),
            }
        default: return prevState;
    }
}

export default reducer