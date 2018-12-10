var gridOptions = {
    columnDefs: [
        { headerName: '', field: 'checked', cellRenderer: 'iconRenderer' },
        { headerName: 'Athlete', field: 'athlete' },
        { headerName: 'Sport', field: 'sport' },
        { headerName: 'Age', field: 'age' },
        { headerName: 'Year', field: 'year' },
        { headerName: 'Date', field: 'date' },
        { headerName: 'Gold', field: 'gold' },
        { headerName: 'Silver', field: 'silver' },
        { headerName: 'Bronze', field: 'bronze' },
    ],
    rowData: null,
    components: {
        iconRenderer: iconRenderer,
    },
};

function iconRenderer(params) {
    let image = new Image();
    image.src = params.value ? imageUrls[0] : imageUrls[1];
    image.style.height = '100%';
    return image;
}

document.addEventListener('DOMContentLoaded', function() {
    // ========== PRELOAD IMAGES BEFORE BUILDING GRID =========
    preloadImages();

    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    agGrid
        .simpleHttpRequest({
            url:
                'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json',
        })
        .then(function(data) {
            data.forEach(d => (d.checked = Math.random() < 0.5));
            gridOptions.api.setRowData(data);
        });
});

let imageArr = [];
let imageUrls = [
    'https://res.cloudinary.com/ahmedagadir/image/upload/v1542809975/random/shield.png',
    'https://res.cloudinary.com/ahmedagadir/image/upload/v1542809987/random/cross.png',
];

function preloadImages() {
    imageUrls.forEach(url => {
        let image = new Image();
        image.className = 'check-icon';
        image.src = url;
        return image;
    });
}
