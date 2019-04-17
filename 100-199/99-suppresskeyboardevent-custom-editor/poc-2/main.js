var students = [
    {
        first_name: 'Bob', last_name: 'Harrison', gender: 'Male',
        address: '1197 Thunder Wagon Common, Cataract, RI, 02987-1016, US, (401) 747-0763',
        mood: "Happy", country: 'Ireland'
    }, {
        first_name: 'Mary', last_name: 'Wilson', gender: 'Female',
        age: 11, address: '3685 Rocky Glade, Showtucket, NU, X1E-9I0, CA, (867) 371-4215',
        mood: "Sad", country: 'Ireland'
    }, {
        first_name: 'Sadiq', last_name: 'Khan', gender: 'Male', age: 12,
        address: '3235 High Forest, Glen Campbell, MS, 39035-6845, US, (601) 638-8186',
        mood: "Happy", country: 'Ireland'
    }, {
        first_name: 'Jerry', last_name: 'Mane', gender: 'Male', age: 12,
        address: '2234 Sleepy Pony Mall , Drain, DC, 20078-4243, US, (202) 948-3634',
        mood: "Happy", country: 'Ireland'
    }
];

var columnDefs = [
    { headerName: "First Name", field: "first_name", width: 100, editable: true },
    { headerName: "Last Name", field: "last_name", width: 100, editable: true },
    {
        headerName: "Gender",
        field: "gender",
        width: 90,
        cellEditor: 'mySimpleCellEditor'
    },
    {
        headerName: "Age",
        field: "age",
        width: 70,
        cellEditor: 'mySimpleCellEditor'
    },
    {
        headerName: "Mood",
        field: "mood",
        width: 70,
        cellEditor: 'mySimpleCellEditor'
    },
    {
        headerName: "Country",
        field: "country",
        width: 100,
        cellEditor: 'mySimpleCellEditor'
    },
    {
        headerName: "Address",
        field: "address",
        width: 502,
        cellEditor: 'mySimpleCellEditor'
    }
];

var gridOptions = {
    columnDefs: columnDefs,
    defaultColDef: {
        editable: true
    },
    rowData: students,
    components: {
        mySimpleCellEditor: MySimpleCellEditor
    },
    suppressKeyboardEvent: params => {
        if (params.editing) {
            // if (params.event.key.length === 1) {
            //     let currentlyEditingCell = params.api.getCellEditorInstances({ rowNodes: [params.node], columns: [params.column] })[0]
            //     currentlyEditingCell.gui.value += params.event.key;
            //     return true
            // } else {
            return false
            // }
        } else {
            // if (params.event.keyCode === KEY_ENTER) {
            //     let { rowIndex, column } = params.api.getFocusedCell();
            //     params.api.startEditingCell({ rowIndex: rowIndex, colKey: column.colId });
            // }
            // include checks for tab, shift + tab etc
            return false;
        }
        return params.editing;
    }
};

let KEY_BACKSPACE = 8;
let KEY_F2 = 113;
let KEY_DELETE = 46;
let KEY_ENTER = 13;


function MySimpleCellEditor() { }

MySimpleCellEditor.prototype.init = function (params) {
    this.gui = document.createElement('input');
    this.gui.type = 'text';
    this.gui.classList.add('my-simple-editor');

    this.params = params;

    var startValue;

    let keyPressBackspaceOrDelete =
        params.keyPress === KEY_BACKSPACE
        || params.keyPress === KEY_DELETE;

    if (keyPressBackspaceOrDelete) {
        startValue = '';
    } else if (params.charPress) {
        startValue = params.charPress;
    } else {
        startValue = params.value;
    }

    if (startValue !== null && startValue !== undefined) {
        this.gui.value = startValue;
    }
};

// MySimpleCellEditor.prototype.processInputEvent = function (event) {
//     if (event.key.length === 1) {
//         //pressed key is a char
//         this.gui.value += event.key;
//     } else {
//         //pressed key is a non-char
//         //e.g. 'esc', 'backspace', 'up arrow'
//         switch (event.keyCode) {
//             case KEY_BACKSPACE:
//                 this.gui.value = this.gui.value.substring(0, this.gui.value.length - 1);
//                 break;
//             case KEY_ENTER:
//                 this.params.api.stopEditing();
//                 this.params.api.setFocusedCell(this.params.rowIndex, this.params.column.colId, null);
//                 break;
//             // tab, shift+tab etc
//             default:
//         }
//     }
// }

MySimpleCellEditor.prototype.getGui = function () {
    return this.gui;
};

MySimpleCellEditor.prototype.getValue = function () {
    return this.gui.value;
};

MySimpleCellEditor.prototype.afterGuiAttached = function () {
    this.gui.focus();
    this.gui.select();
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
});


// MySimpleCellEditor.prototype.myCustomFunction = function() {
//     return {
//         rowIndex: this.params.rowIndex,
//         colId: this.params.column.getId()
//     };
// };
