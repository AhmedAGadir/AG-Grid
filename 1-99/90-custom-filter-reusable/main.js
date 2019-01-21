
var columnDefs = [
    { field: 'movie' },
    { field: 'plot', filter: StarFilter },
    { field: 'humour', filter: StarFilter }
];

var rowData = [
    {
        movie: 'The Godfather',
        plot: 5,
        humour: 2
    },
    {
        movie: 'The Shawshank Redemption',
        plot: 5,
        humour: 3
    }
];

var gridOptions = {
    defaultColDef: {
        filter: true
    },
    columnDefs: columnDefs,
    rowData: rowData
};

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
});

function StarFilter() { }

StarFilter.prototype.init = function (params) {
    this.params = params;
    this.valueGetter = params.valueGetter;

    this.eGui = document.createElement('div');
    this.id = 'rateYo' + params.colDef.field;
    this.eGui.setAttribute('id', this.id);
}

StarFilter.prototype.getGui = function () {
    return this.eGui;
}

StarFilter.prototype.afterGuiAttached = function () {
    $("#" + this.id).rateYo({
        starWidth: "20px",
        fullStar: true,
        onSet: rating => {
            this.filterText = rating;
            this.params.filterChangedCallback();
        },
    });
}

StarFilter.prototype.isFilterActive = function () {
    return $("#" + this.id).rateYo('rating') !== 0;
}

StarFilter.prototype.doesFilterPass = function (params) {
    console.log('doesFilterPass', this.valueGetter(params))
    return this.valueGetter(params) === $("#" + this.id).rateYo('rating');
}

StarFilter.prototype.getModel = function () {
    var model = { value: $("#" + this.id).rateYo('rating') };
    return model;
};

StarFilter.prototype.setModel = function (model) {
    $("#" + this.id).rateYo('rating', model.value);
};
