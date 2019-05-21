
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
    { player: 'Lionel Messi', shooting: 94, passing: 90, dribbling: 98, defense: 42 },
    { player: 'Cristiano Ronaldo', shooting: 96, passing: 86, dribbling: 95, defense: 45 },
    { player: 'Luis Suárez', shooting: 92, passing: 83, dribbling: 92, defense: 55 },
    { player: 'Gonzalo Higuaín', shooting: 90, passing: 74, dribbling: 86, defense: 37 },
    { player: 'Neymar da Silva Santos', shooting: 88, passing: 83, dribbling: 96, defense: 38 },
    { player: 'Alexis Sánchez', shooting: 86, passing: 81, dribbling: 91, defense: 49 },
    { player: 'Zlatan Ibrahimović', shooting: 93, passing: 86, dribbling: 90, defense: 48 },
    { player: 'Robert Lewandowski', shooting: 89, passing: 76, dribbling: 88, defense: 48 },
    { player: 'Eden Hazard', shooting: 87, passing: 87, dribbling: 93, defense: 45 },
    { player: 'Antoine Griezmann', shooting: 86, passing: 83, dribbling: 90, defense: 40 },
    { player: 'Greg Stewart', shooting: 65, passing: 57, dribbling: 67, defense: 42 },
    { player: 'Ivan Kovacec', shooting: 70, passing: 63, dribbling: 66, defense: 45 },
    { player: 'Lucas Terreira', shooting: 62, passing: 77, dribbling: 81, defense: 55 },
    { player: 'Lee Jae Sung', shooting: 64, passing: 74, dribbling: 72, defense: 37 },
    { player: 'Matty Taylor', shooting: 70, passing: 58, dribbling: 68, defense: 38 },
    { player: 'Marcos Acuna', shooting: 72, passing: 79, dribbling: 82, defense: 49 },
    { player: 'Goncalo Guedes', shooting: 77, passing: 73, dribbling: 81, defense: 48 },
    { player: 'Diogo Jota', shooting: 75, passing: 68, dribbling: 70, defense: 48 },
    { player: 'Giovani Lo Celso', shooting: 69, passing: 80, dribbling: 53, defense: 45 },
    { player: 'Vincent Janssen', shooting: 79, passing: 54, dribbling: 81, defense: 40 },
    { player: 'Kiko', shooting: 54, passing: 60, dribbling: 66, defense: 60 },
    { player: 'Markus Furseth', shooting: 48, passing: 51, dribbling: 52, defense: 44 },
    { player: 'Thomas Grogaard', shooting: 44, passing: 61, dribbling: 66, defense: 63 },
    { player: 'Kenneth Otigba', shooting: 36, passing: 48, dribbling: 54, defense: 67 },
    { player: 'Erik Wille', shooting: 31, passing: 49, dribbling: 45, defense: 57 },
    { player: 'Alexander Hien', shooting: 36, passing: 52, dribbling: 54, defense: 56 },
    { player: 'Jannis Plaschke', shooting: 44, passing: 56, dribbling: 57, defense: 53 },
    { player: 'Michele Pellizzer', shooting: 30, passing: 33, dribbling: 44, defense: 69 },
    { player: 'Vincent Janssen', shooting: 79, passing: 54, dribbling: 81, defense: 40 }

];

var gridOptions = {
    columnDefs: columnDefs,
    rowData: rowData,
    defaultColDef: {
        menuTabs: ['filterMenuTab']
    },
    sideBar: 'filters',
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
    this.eGui.style.margin = '10px';

    this.eStarWrapper = document.createElement('div');
    this.eGui.appendChild(this.eStarWrapper);

    this.eButton = document.createElement('button');
    this.eButton.style.marginTop = '10px';
    this.eButton.addEventListener('click', () => {
        $(this.eStarWrapper).rateYo('rating', 0);
    });
    this.eButton.textContent = 'Clear Filter';
    this.eGui.appendChild(this.eButton);
}

StarFilter.prototype.getGui = function () {
    return this.eGui;
}

StarFilter.prototype.afterGuiAttached = function (params) {
    console.log('afterGuiAttached', params)
    $(this.eStarWrapper).rateYo({
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
