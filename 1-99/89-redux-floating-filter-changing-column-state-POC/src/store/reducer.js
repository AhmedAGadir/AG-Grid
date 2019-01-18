import * as actionTypes from './actionTypes';

const initialState = {
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete', width: 200, isFloatingFilterVisible: true },
        { headerName: 'Sport', field: 'sport', width: 200, isFloatingFilterVisible: true },
        { headerName: 'Age', field: 'age', width: 200, isFloatingFilterVisible: true },
        { headerName: 'Year', field: 'year', width: 200, isFloatingFilterVisible: true },
        { headerName: 'Date', field: 'date', width: 200, isFloatingFilterVisible: true },
        { headerName: 'Gold', field: 'gold', width: 200, isFloatingFilterVisible: true },
        { headerName: 'Silver', field: 'silver', width: 200, isFloatingFilterVisible: true },
        { headerName: 'Bronze', field: 'bronze', width: 200, isFloatingFilterVisible: true }
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
            const updatedColDefs = action.columnApi
                .getAllGridColumns() // need to use this callback to get the grids columns in the order that they are displayed
                .map(col => ({
                    headerName: col.colDef.headerName,
                    field: col.colDef.field,
                    width: 200,
                    isFloatingFilterVisible: col === action.column ? !col.colDef.isFloatingFilterVisible : col.colDef.isFloatingFilterVisible
                }))
            return {
                ...prevState,
                columnDefs: updatedColDefs,
                rowData: prevState.rowData.map(row => ({ ...row })),
            }
        default: return prevState;
    }
}

export default reducer