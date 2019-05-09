
var columnDefs = [
    {
        field: 'player',
    },
    {
        field: 'passing',
        filter: StarFilter,
    },
    {
        field: 'shooting',
        filter: StarFilter,
        filterParams: {
            starWidth: 30,
            numStars: 5,
            fill: "dodgerblue",
        }
    },
    {
        field: 'dribbling',
        filter: StarFilter,
        filterParams: {
            rtl: true,
            numStars: 20,
            spacing: 5
        }
    },
    {
        field: 'defense',
        filter: StarFilter,
        filterParams: {
            starWidth: 200,
            numStars: 1,
            fill: '#00FF00'
        }
    }
];

// get a wider range of football players
// https://www.futhead.com/players/?page=2 (change the page number)

var rowData = [
    { player: 'Lionel Messi', pace: 95, shooting: 94, passing: 90, dribbling: 98, defense: 42, physical: 70 },
    { player: 'Cristiano Ronaldo', pace: 95, shooting: 96, passing: 86, dribbling: 95, defense: 45, physical: 87 },
    { player: 'Luis Suárez', pace: 85, shooting: 92, passing: 83, dribbling: 92, defense: 55, physical: 83 },
    { player: 'Gonzalo Higuaín', pace: 83, shooting: 90, passing: 74, dribbling: 86, defense: 37, physical: 79 },
    { player: 'Neymar da Silva Santos', pace: 94, shooting: 88, passing: 83, dribbling: 96, defense: 38, physical: 65 },
    { player: 'Alexis Sánchez', pace: 89, shooting: 86, passing: 81, dribbling: 91, defense: 49, physical: 74 },
    { player: 'Zlatan Ibrahimović', pace: 77, shooting: 93, passing: 86, dribbling: 90, defense: 48, physical: 88 },
    { player: 'Robert Lewandowski', pace: 84, shooting: 89, passing: 76, dribbling: 88, defense: 48, physical: 85 },
    { player: 'Eden Hazard', pace: 92, shooting: 87, passing: 87, dribbling: 93, defense: 45, physical: 69 },
    { player: 'Antoine Griezmann', pace: 88, shooting: 86, passing: 83, dribbling: 90, defense: 40, physical: 72 }
];

var gridOptions = {
    columnDefs: columnDefs,
    rowData: rowData,
    onFirstDataRendered: params => params.columnApi.autoSizeAllColumns(),
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
        starWidth: this.params.starWidth ? this.params.starWidth + 'px' : '20px',
        ratedFill: this.params.fill ? this.params.fill : '#F39C12',
        numStars: this.params.numStars ? this.params.numStars : 10,
        rtl: this.params.rtl ? this.params.rtl : false,
        spacing: this.params.spacing ? this.params.spacing + 'px' : '0px',
        precision: 1,
        onSet: rating => {
            console.log(rating * 20);
            this.stars = rating ? rating : null;
            this.params.filterChangedCallback();
        },
    });
}

StarFilter.prototype.isFilterActive = function () {
    return this.stars !== null;
}

StarFilter.prototype.doesFilterPass = function (params) {
    return params.data[this.fieldId] <= this.stars * 20;
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
