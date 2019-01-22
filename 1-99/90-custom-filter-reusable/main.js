
var columnDefs = [
    { field: 'movie' },
    {
        field: 'plot',
        type: 'starFilter',
    },
    {
        field: 'humour',
        type: 'starFilter',
        filterParams: {
            starWidth: '40px'
        }
    }
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
    columnDefs: columnDefs,
    columnTypes: {
        starFilter: {
            filter: StarFilter,
            filterParams: {
                starWidth: '20px'
            }
        }
    },
    rowData: rowData,
};

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
});

function StarFilter() { }

StarFilter.prototype.init = function (params) {
    // The number of stars selected by the user
    this.stars = null;
    this.params = params;
    this.fieldId = params.colDef.field;
    this.eGui = document.createElement('div');
}

StarFilter.prototype.getGui = function () {
    return this.eGui;
}

StarFilter.prototype.afterGuiAttached = function () {
    $(this.eGui).rateYo({
        starWidth: this.params.starWidth,
        fullStar: true,
        onSet: rating => {
            this.stars = rating !== 0 ? rating : null;
            this.params.filterChangedCallback();
        },
    });
}

StarFilter.prototype.isFilterActive = function () {
    return this.stars !== null;
}

StarFilter.prototype.doesFilterPass = function (params) {
    return params.data[this.fieldId] === this.stars;
}

// The following 2 methods arent used for filtering directly, but more for maintaining the grids state

// This component is modeled only with one variable that 
// represents the number of stars that the user is filtering by.
StarFilter.prototype.getModel = function () {
    return this.stars;
};

// setModel might get called by the grid with a null parameter to reset the filter
StarFilter.prototype.setModel = function (numberOfStars) {
    this.stars = numberOfStars;
};
