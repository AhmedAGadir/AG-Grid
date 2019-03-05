var columnDefs = [
	{
		field: "athlete",
		width: 150
	},
	{
		field: "age",
		width: 90,
		filter: 'agNumberColumnFilter',
		filterParams: {
			suppressAndOrCondition: true,
			filterOptions: [
				{
					displayKey: 'lessThan',
					displayName: 'Less Than',
					test: function (filterValue, cellValue) {
						return cellValue !== null && cellValue < filterValue;
					}
				},
				{
					displayKey: 'greaterThan',
					displayName: 'Greater Than',
					test: function (filterValue, cellValue) {
						return cellValue !== null && cellValue > filterValue;
					}
				},
				{
					displayKey: 'isNull',
					displayName: 'Is Null',
					test: function (filterValue, cellValue) {
						return cellValue === null;
					}
				}
			]
		}
	}
];

var gridOptions = {
	columnDefs: columnDefs,
	defaultColDef: {
		sortable: true,
		filter: true,
		menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
	},
	postProcessPopup: postProcessPopup
}

function postProcessPopup(params) {
	if (params.type !== 'columnMenu') {
		return;
	}
	const filterDropDown = document.querySelector('.ag-filter-select');
	const miniFilter = document.querySelector('.ag-filter-filter');

	if (params.column.selectListenerAdded) {
		showOrHideMiniFilter(filterDropDown, miniFilter, params);
	} else {
		filterDropDown.addEventListener('change', () => {
			showOrHideMiniFilter(filterDropDown, miniFilter, params);
		});
		params.column.selectListenerAdded = true
	}
}

function showOrHideMiniFilter(filterDropDown, miniFilter, params) {
	if (filterDropDown.value === 'isNull') {
		miniFilter.classList.add('hide');
	} else {
		miniFilter.classList.remove('hide');
	}
	// for filtering to take effect, the filter model must be set (any value will do)
	params.column.gridApi.setFilterModel({
		[params.column.colDef.field]: {
			type: filterDropDown.value,
			// we dont want the 0 value to populate the minifilter when it reappears,
			filter: filterDropDown.value === 'isNull' ? 0 : Number(miniFilter.value) ? miniFilter.value : ''
		}
	})
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
	var gridDiv = document.querySelector('#myGrid');
	new agGrid.Grid(gridDiv, gridOptions);

	agGrid.simpleHttpRequest({ url: 'https://raw.githubusercontent.com/ag-grid/ag-grid/latest/packages/ag-grid-docs/src/javascript-grid-filtering/custom-filter-options/data/data.json' })
		.then(function (data) {
			gridOptions.api.setRowData(data);
		}
		);
});