var columnDefs = [
	{ field: 'id' },
	{ field: 'athlete', width: 150 },
	{ field: 'age' },
	{ field: 'country' },
	{ field: 'year' },
	{ field: 'sport' },
	{ field: 'gold' },
	{ field: 'silver' },
	{ field: 'bronze' }
];

var gridOptions = {
	defaultColDef: {
		width: 120,
		suppressFilter: true
	},
	columnDefs: columnDefs,
	// use the server-side row model
	rowModelType: 'serverSide',
	// fetch 100 rows per at a time
	cacheBlockSize: 100,
	// only keep 10 blocks of rows
	maxBlocksInCache: 10,
	enableColResize: true,
	animateRows: true,
	// debug: true,
	components: {
		customLoadingOverlay: CustomLoadingOverlay,
	},
	loadingOverlayComponent: 'customLoadingOverlay',
	loadingOverlayComponentParams: {
		loadingMessage: () => {
			return 'Loading...';
		}
	},
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
	var gridDiv = document.querySelector('#myGrid');
	new agGrid.Grid(gridDiv, gridOptions);

	agGrid.simpleHttpRequest({ url: 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json' }).then(function (data) {
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

function ServerSideDatasource(server) {
	return {
		getRows(params) {

			new Promise(resolve => {

				let updateProgressBar = setInterval(() => {

					let response = server.getResponse(params.request);

					if (response.loading) {
						// update overlay

					} else {

						clearInterval(updateProgressBar);
						resolve({
							success: response.success,
							rows: response.rows,
							lastRow: response.lastRows
						})

					}

				}, 25)

			})
				.then(({ success, rows, lastRow }) => {
					if (success) {
						params.successCallback(rows, lastRow);
					} else {
						params.failCallback();
					}
				})
				.catch(err => {
					// handle error;
					console.log(err);
					params.failCallback();
				})
		}
	};
}

function FakeServer(allData) {
	var progress = 0;
	var loading = false;
	return {
		getResponse(request) {
			// console.log('asking for rows: ' + request.startRow + ' to ' + request.endRow);

			if (!loading && progress === 0) {
				var simulateLoading = setInterval(() => {
					progress++;
					if (progress === 100) {
						loading = false;
						clearInterval(simulateLoading);
					}
				}, 15);

				loading = true;
			}

			let response = {
				success: true,
				loading: loading,
				progress: progress
			}

			if (progress === 100) {
				var rowsThisPage = allData.slice(request.startRow, request.endRow);
				var lastRow = allData.length <= request.endRow ? data.length : -1;

				response.rows = rowsThisPage;
				response.lastRow = lastRow

				progress = 0;
			}

			return response;

		}
	};
}

function showLoadingOverlay() {
	gridOptions.api.showLoadingOverlay();
}

function CustomLoadingOverlay() { }

CustomLoadingOverlay.prototype.init = function (params) {
	var eTemp = document.createElement('div');
	eTemp.innerHTML = '<span class="ag-overlay-loading-center">' + params.loadingMessage() + '</span>';
	this.eGui = eTemp.firstElementChild;
};

CustomLoadingOverlay.prototype.getGui = function () {
	return this.eGui;
};