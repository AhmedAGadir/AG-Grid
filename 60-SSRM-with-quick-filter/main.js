//USEFUL SSRM METHODS 
// gridOptions.api.serverSideRowModel.datasource.getRows();

var columnDefs = [
	{ field: 'id' },
	{ field: 'athlete', width: 150 },
	{ field: 'age' },
	{ field: 'country' },
	{ field: 'year' },
	{ field: 'sport' },
	{ field: 'gold' },
	{ field: 'silver' },
	{ field: 'bronze' },
];

var gridOptions = {
	defaultColDef: {
		width: 120,
		suppressFilter: true,
	},
	columnDefs: columnDefs,
	rowModelType: 'serverSide',
	cacheBlockSize: 100,
	maxBlocksInCache: 10,
	enableColResize: true,
	animateRows: true,
};

document.addEventListener('DOMContentLoaded', function () {
	var gridDiv = document.querySelector('#myGrid');
	new agGrid.Grid(gridDiv, gridOptions);

	agGrid
		.simpleHttpRequest({
			url:
				'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json',
		})
		.then(function (data) {
			// add id to data
			var idSequence = 0;
			data.forEach(function (item) {
				item.id = idSequence++;
			});

			var server = new FakeServer(data);
			var datasource = new ServerSideDatasource(server);
			gridOptions.api.setServerSideDatasource(datasource);
		});
});

function doQuickFilter() {
	const filterInput = document.getElementById('filter-input');
	gridOptions.api.setQuickFilter(filterInput.value);
}

function ServerSideDatasource(server) {
	let cache;
	return {
		// isCacheReady() {
		// 	return cache != null;
		// },
		// setCache(newCache) {
		// 	cache = newCache;
		// },
		// getCache() {
		// 	return cache;
		// },
		//WE SHOULD PASS THE CACHE HERE!!!!!!!
		getRows(params) {
			console.log('getRows', params.request);
			// adding delay to simulate real sever call
			setTimeout(function () {
				let serverRequest = params.request;

				let quickFilter = document.getElementById('filter-input').value;

				if (quickFilter) {
					let filteredResults = cache.filter(row => {
						return Object.values(row).join('\n').toLowerCase().includes(quickFilter.toString().toLowerCase())
					})
					// *********** NOTE: using -1 for the lastRow paramater will result in the grid simulating infinite rows,
					// using the length of the results will give a cleaner look for a fixed number of rows ************
					params.successCallback(filteredResults, filteredResults.length);
					return;
				}

				var response = server.getResponse(serverRequest);

				if (response.success) {
					// call the success callback
					params.successCallback(response.rows, response.lastRow);
					//Because we dont have an event for after rowData has changed
					setTimeout(() => {
						cache = [];
						gridOptions.api.forEachNode(node => cache.push(node.data));
					}, 0)

				} else {
					// inform the grid request failed
					params.failCallback();
				}
			}, 500);
		},
	};
}

function FakeServer(allData) {
	return {
		getResponse(request) {
			console.log('Server has been called: ', request);

			// take a slice of the total rows
			var rowsThisPage = allData.slice(request.startRow, request.endRow);

			// if on or after the last page, work out the last row.
			var lastRow = allData.length <= request.endRow ? data.length : -1;

			return {
				success: true,
				rows: rowsThisPage,
				lastRow: lastRow,
			};
		},
	};
}
