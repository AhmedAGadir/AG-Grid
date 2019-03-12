'use strict';

import React, { Component } from 'react';
import { render } from 'react-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';

class GridExample extends Component {
	constructor(props) {
		super(props);

		this.state = {
			columnDefs: [
				{ field: "locked", colId: 'locked', lockPosition: true, suppressMenu: true, suppressToolPanel: true },
				{ field: "athlete", colId: "athlete" },
				{ field: "country", colId: 'country' },
				{ field: 'custom', colId: 'custom' }
			],
			rowData: null,
		};
	}

	onGridReady(params) {
		this.gridApi = params.api;
		this.gridColumnApi = params.columnApi;

		// set up: clear local storage before starting
		if (!localStorage.getItem('colState')) {

			this.setState({
				columnDefs: [
					{ field: "locked", colId: 'locked', width: 150, pinned: 'left', lockPosition: true, suppressMenu: true, suppressToolPanel: true },
					{ field: "athlete", colId: 'athlete', width: 90 },
					{ field: "country", colId: 'country', width: 120 }
				],
			});
			let initColState = this.gridColumnApi.getColumnState();
			console.log('initial col state', initColState);
			localStorage.setItem('colState', JSON.stringify(initColState));

		} else {

			let colState = JSON.parse(localStorage.getItem('colState'));
			// since were using delta columns we can directly change the columns (no need to make api calls)
			// the catch is that we have to sync any changes directed from the UI with our state (See: https://www.ag-grid.com/javascript-grid-column-definitions/#delta-columns)
			let updatedColDefs = this.state.columnDefs.map(colDef => {
				let colStateInd = colState.findIndex(col => col.colId === colDef.colId);
				return {
					...colDef,
					...colState[colStateInd]
				};
			})
			console.log('updatedColDefs', updatedColDefs);
			this.setState({ columnDefs: updatedColDefs });

		}

		const updateData = data => {
			this.setState({ rowData: data });
		};
		const httpRequest = new XMLHttpRequest();
		httpRequest.open('GET', 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json');
		httpRequest.send();
		httpRequest.onreadystatechange = () => {
			if (httpRequest.readyState === 4 && httpRequest.status === 200) {
				updateData(JSON.parse(httpRequest.responseText));
			}
		};

	}

	render() {
		return (
			<div style={{ width: '100%', height: '100%' }}>
				<div
					id="myGrid"
					style={{
						boxSizing: 'border-box',
						height: '100%',
						width: '100%',
					}}
					className="ag-theme-balham"
				>
					<AgGridReact
						columnDefs={this.state.columnDefs}
						deltaColumnMode={true}
						onGridReady={this.onGridReady.bind(this)}
						rowData={this.state.rowData}
						toolPanel={true}
						sideBar={true}
					/>
				</div>
			</div>
		);
	}
}

render(<GridExample />, document.querySelector('#root'));
