import * as actionTypes from './actionTypes';

const initialState = {
    columnDefs: [
        { headerName: "Make", field: "make" },
        { headerName: "Model", field: "model" },
        { headerName: "Price", field: "price" }

    ],
    rowData: null,
}

const reducer = (prevState = initialState, action) => {
    switch (action.type) {

    }
}