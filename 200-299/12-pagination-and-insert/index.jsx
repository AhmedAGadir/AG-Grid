import React, { Component } from "react";
import { render } from "react-dom";
import { AgGridReact } from "ag-grid-react";
import axios from 'https://unpkg.com/axios@0.18.0/dist/axios.min.js';

import Form from './form.jsx';

class GridExample extends Component {
	constructor(props) {
		super(props);
		this.state = {
			columnDefs: [{ field: "athlete" }, { field: "sport" }],
			pagination: true,
			rowModelType: "infinite",
			cacheOverflowSize: 1,
			maxConcurrentDatasourceRequests: 10,
			infiniteInitialRowCount: 1000,
			maxBlocksInCache: 1,
			paginationPageSize: 10,
			cacheBlockSize: 10,
		};
	}

	getRowNodeId = data => data.id;

	onGridReady = params => {
		this.gridApi = params.api;
		this.gridColumnApi = params.columnApi;

		var dataSource = {
			getRows: function (params) {
				setTimeout(async () => {
					var response = await this.apiService(params.startRow, params.endRow);
					if (response.status == 200) {
						params.successCallback(response.data, response.totalElements);
					} else {
						params.failCallback();
					}
				}, 0);
			},
			apiService: async (startRow, endRow) => {
				const response = await axios.get('https://ag-grid-pagination.firebaseio.com/users.json');

				let allRows = Object.keys(response.data).map(key => ({
					id: key,
					athlete: response.data[key].athlete,
					sport: response.data[key].sport,
				}))
				return {
					status: response.status,
					data: allRows.slice(startRow, endRow),
					totalElements: allRows.length
				};
			},
		};

		params.api.setDatasource(dataSource);
	};

	addAthleteHandler = (athleteDetails) => {
		axios.post('https://ag-grid-pagination.firebaseio.com/users.json', athleteDetails)
			.then(res => {
				console.log(res);

				// refresh the cache
				this.gridApi.refreshInfiniteCache();
				// this.gridApi.purgeInfiniteCache();
			})
			.catch(err => console.log(err))
	}

	render() {
		return (
			<div style={{ height: "100vh", paddingTop: '20px' }} >
				<Form addAthlete={this.addAthleteHandler} />
				<div
					id="myGrid"
					style={{ height: "400px" }}
					className="ag-theme-balham">
					<AgGridReact
						columnDefs={this.state.columnDefs}
						components={this.state.components}
						pagination={this.state.pagination}
						rowModelType={this.state.rowModelType}
						cacheOverflowSize={this.state.cacheOverflowSize}
						maxConcurrentDatasourceRequests={this.state.maxConcurrentDatasourceRequests}
						infiniteInitialRowCount={this.state.infiniteInitialRowCount}
						maxBlocksInCache={this.state.maxBlocksInCache}
						paginationPageSize={this.state.paginationPageSize}
						cacheBlockSize={this.state.cacheBlockSize}
						getRowNodeId={this.getRowNodeId}
						onGridReady={this.onGridReady} />
				</div>
			</div>
		);
	}
}

render(<GridExample />, document.querySelector("#root"));