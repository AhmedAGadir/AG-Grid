var students = [
    {
        first_name: 'Bob', last_name: 'Harrison', gender: 'Male',

        mood: "Happy", country: { name: 'Ireland', code: 'IE' }
    }, {
        first_name: 'Mary', last_name: 'Wilson', gender: 'Female',

        mood: "Sad", country: { name: 'Ireland', code: 'IE' }
    }, {
        first_name: 'Sadiq', last_name: 'Khan', gender: 'Male',
        mood: "Happy", country: { name: 'Ireland', code: 'IE' }
    }, {
        first_name: 'Jerry', last_name: 'Mane', gender: 'Male',
        mood: "Happy", country: { name: 'Ireland', code: 'IE' }
    }
];

var columnDefs = [
    {
        headerName: "Gender",
        field: "gender",
        width: 90,
        editable: true,
        cellRenderer: 'genderCellRenderer',
        cellEditor: 'agRichSelectCellEditor',
        cellEditorParams: {
            cellRenderer: 'genderCellRenderer',
            values: ['Male', 'Female']
        }
    },
    {
        headerName: "Mood",
        field: "mood",
        width: 70,
        cellRenderer: 'moodCellRenderer',
        cellEditor: 'moodEditor',
        editable: true
    },
    {
        headerName: "Country",
        field: "country",
        width: 100,
        cellRenderer: 'countryCellRenderer',
        cellEditor: 'agRichSelectCellEditor',
        cellEditorParams: {
            cellRenderer: 'countryCellRenderer',
            values: [
                { name: 'Ireland', code: 'IE' },
                { name: 'UK', code: 'UK' },
                { name: 'France', code: 'FR' }
            ]
        },
        editable: true
    }
];

var gridOptions = {
    columnDefs: columnDefs,
    rowData: students,
    onGridReady: function (params) {
        params.api.sizeColumnsToFit();
    },
    onCellEditingStarted: function (event) {
        console.log('cellEditingStarted');
    },
    onCellEditingStopped: function (event) {
        console.log('cellEditingStopped');
    },
    components: {
        genderCellRenderer: GenderCellRenderer,
        moodCellRenderer: MoodCellRenderer,
        moodEditor: MoodEditor,
        countryCellRenderer: CountryCellRenderer
    }
};

// simple function cellRenderer, just returns back the name of the country
function CountryCellRenderer(params) {
    return params.value.name;
}

function GenderCellRenderer() {
}

GenderCellRenderer.prototype.init = function (params) {
    this.eGui = document.createElement('span');
    if (params.value !== "" || params.value !== undefined || params.value !== null) {
        var gender = '<img border="0" width="15" height="10" src="https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/images/' + params.value.toLowerCase() + '.png">';
        this.eGui.innerHTML = gender + ' ' + params.value;
    }
};

GenderCellRenderer.prototype.getGui = function () {
    return this.eGui;
};

function MoodCellRenderer() {
}

MoodCellRenderer.prototype.init = function (params) {
    this.eGui = document.createElement('span');
    if (params.value !== "" || params.value !== undefined || params.value !== null) {
        var imgForMood = params.value === 'Happy' ? 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/images/smiley.png' : 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/images/smiley-sad.png';
        this.eGui.innerHTML = '<img width="20px" src="' + imgForMood + '" />';
    }
};

MoodCellRenderer.prototype.getGui = function () {
    return this.eGui;
};

function MoodEditor() {
    this.defaultImgStyle = 'padding-left:10px; padding-right:10px;  border: 1px solid transparent; padding: 4px;';
    this.selectedImgStyle = 'padding-left:10px; padding-right:10px; border: 1px solid lightgreen; padding: 4px;';
}

MoodEditor.prototype.onKeyDown = function (event) {
    var key = event.which || event.keyCode;
    if (key == 37 ||  // left
        key == 39) {  // right
        this.toggleMood();
        event.stopPropagation();
    }
};

MoodEditor.prototype.toggleMood = function () {
    this.selectMood(this.mood === 'Happy' ? 'Sad' : 'Happy');
};

MoodEditor.prototype.init = function (params) {
    this.container = document.createElement('div');
    this.container.style = "border-radius: 15px; border: 1px solid grey;background: #e6e6e6;padding: 15px; text-align:center;display:inline-block;outline:none";
    this.container.tabIndex = "0";                // to allow the div to capture keypresses

    this.happyImg = document.createElement('img');
    this.happyImg.src = 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/images/smiley.png';
    this.happyImg.style = this.defaultImgStyle;

    this.sadImg = document.createElement('img');
    this.sadImg.src = 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/images/smiley-sad.png';
    this.sadImg.style = this.defaultImgStyle;

    this.container.appendChild(this.happyImg);
    this.container.appendChild(this.sadImg);

    var that = this;
    this.happyImg.addEventListener('click', function (event) {
        that.selectMood('Happy');
        params.stopEditing();
    });
    this.sadImg.addEventListener('click', function (event) {
        that.selectMood('Sad');
        params.stopEditing();
    });
    this.container.addEventListener('keydown', function (event) {
        that.onKeyDown(event)
    });

    this.selectMood(params.value);
};

MoodEditor.prototype.selectMood = function (mood) {
    this.mood = mood;
    this.happyImg.style = (mood === 'Happy') ? this.selectedImgStyle : this.defaultImgStyle;
    this.sadImg.style = (mood === 'Sad') ? this.selectedImgStyle : this.defaultImgStyle;
};

// gets called once when grid ready to insert the element
MoodEditor.prototype.getGui = function () {
    return this.container;
};

MoodEditor.prototype.afterGuiAttached = function () {
    this.container.focus();
};

MoodEditor.prototype.getValue = function () {
    return this.mood;
};

// any cleanup we need to be done here
MoodEditor.prototype.destroy = function () {
};

MoodEditor.prototype.isPopup = function () {
    return true;
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
});
