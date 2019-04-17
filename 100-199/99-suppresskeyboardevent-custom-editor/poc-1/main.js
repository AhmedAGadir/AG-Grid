var students = [
    {
        first_name: 'Bob',
        last_name: 'Harrison',
        mood: "Happy",
        country: { name: 'Ireland', code: 'IE' }
    },
    {
        first_name: 'Mary',
        last_name: 'Wilson',
        mood: "Sad",
        country: { name: 'Ireland', code: 'IE' }
    },
    {
        first_name: 'Sadiq',
        last_name: 'Khan',
        mood: "Happy",
        country: { name: 'Ireland', code: 'IE' }
    },
    {
        first_name: 'Jerry',
        last_name: 'Mane',
        mood: "Happy",
        country: { name: 'Ireland', code: 'IE' }
    }
];

var columnDefs = [
    {
        headerName: "Mood",
        field: "mood",
        width: 200,
        cellRenderer: 'moodCellRenderer',
        cellEditor: 'moodEditor',
        editable: true,
        suppressKeyboardEvent: params => {
            params.api.stopEditing();
            params.api.setFocusedCell(params.node.rowIndex, params.column.colId, null);
            return params.editing;
        }
    }
];

var gridOptions = {
    columnDefs: columnDefs,
    rowData: students,
    onCellEditingStarted: function (event) {
        console.log('cellEditingStarted');
    },
    onCellEditingStopped: function (event) {
        console.log('cellEditingStopped');
    },
    components: {
        moodCellRenderer: MoodCellRenderer,
        moodEditor: MoodEditor,
    }
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
    this.defaultImgStyle = 'padding-left:10px; padding-right:10px;  border: 1px solid transparent; padding: 4px; display: block';
    this.selectedImgStyle = 'padding-left:10px; padding-right:10px; border: 1px solid lightgreen; padding: 4px; display: block';
}

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

MoodEditor.prototype.onKeyDown = function (event) {
    var key = event.which || event.keyCode;
    if (key == 38 ||  // up
        key == 40) {  // down
        this.toggleMood();
        event.stopPropagation();
    }
};

MoodEditor.prototype.toggleMood = function () {
    this.selectMood(this.mood === 'Happy' ? 'Sad' : 'Happy');
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
