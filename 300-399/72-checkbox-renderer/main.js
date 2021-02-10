function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

var columnDefs = [
    {headerName: "On/Off", field: "checkboxSelected", width: 100, 
        cellRenderer: Checkbox,
        // editable:true,
        cellRendererParams: {
            changeListener: (e, params) => {
                params.node.setDataValue('checkboxSelected', !params.data.checkboxSelected);
            }
        },
        suppressKeyboardEvent: params => {
            if (params.event.type === 'keypress' && params.event.key === 'Enter') {
                console.log('enter');
                params.node.setDataValue(params.column.colId, !params.data.checkboxSelected);
                return true;
            }
            return false;
        }
    },
    { field: 'checkboxSelected', valueFormatter: params => params.value.toString()}
];

function Checkbox() {}
Checkbox.prototype.init = function(params) {
    this.params = params;
    this.eGui = document.createElement('div');
    // this.eGui.style.backgroundColor = 'green';
    this.eGui.innerHTML = `
        <input 
            type="checkbox" 
            class="checkbox-input"
        />
    `;
    this.eCheckbox = this.eGui.querySelector('.checkbox-input');
    this.eCheckbox.checked = params.value;

    this.dblClickListener = this.dblClickListener.bind(this);

     this.eCheckbox.addEventListener('change', (e) => {
         console.log('checkbox checked');
         params.changeListener(e, params);
     });

    this.eGui.addEventListener('dblclick', this.dblClickListener)
}

Checkbox.prototype.getGui = function() {
    return this.eGui;
}

Checkbox.prototype.destroy = function() {
    this.eCheckbox.removeEventListener('change', (e) => this.params.changeListener(e, params));
    this.eCheckbox.removeEventListener('dblclick', this.dblClickListener);
}

Checkbox.prototype.dblClickListener = function(e) {
        let debouncedChangeListener = debounce(this.params.changeListener, 100);
        if (this.eCheckbox.contains(e.target)) {
            console.log('doubleclick checkbox')
            return;
        }
        debouncedChangeListener(e, this.params);
}

var gridOptions = {
    columnDefs: columnDefs,
    rowData: null
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    // do http request to get our sample data - not using any framework to keep the example self contained.
    // you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', 'https://raw.githubusercontent.com/ag-grid/ag-grid-docs/master/src/olympicWinnersSmall.json');
    httpRequest.send();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            var httpResult = JSON.parse(httpRequest.responseText);
            httpResult.forEach(row => {
                row.checkboxSelected = true;
            })
            gridOptions.api.setRowData(httpResult);
        }
    };
});