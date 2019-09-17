import React, { Component } from 'react';
import './App.css';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';

import MyDetailCellRenderer from './components/MyDetailCellRenderer/MyDetailCellRenderer';
import uuidv4 from 'uuid';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			columnDefs: [
				// group cell renderer needed for expand / collapse icons
				{ field: 'name', cellRenderer: 'agGroupCellRenderer' },
				{ field: 'account' },
				{ field: 'calls' },
				{ field: 'minutes', valueFormatter: "x.toLocaleString() + 'm'" },
			],
			rowData: null
		}
	}

	onGridReady(params) {
		this.gridApi = params.api;
		this.gridColumnApi = params.columnApi;


		const httpRequest = new XMLHttpRequest();
		const updateData = data => {
			this.setState({ rowData: data });
		};

		httpRequest.open(
			"GET",
			"https://raw.githubusercontent.com/ag-grid/ag-grid-docs/latest/src/javascript-grid-master-detail/custom-detail-with-grid/data/data.json"
		);
		httpRequest.send();
		httpRequest.onreadystatechange = () => {
			if (httpRequest.readyState === 4 && httpRequest.status === 200) {
				let textRecordIdSequence = 0;
				let data = JSON.parse(httpRequest.responseText);
				let rowData = data.map(row => ({
					...row,
					callRecords: row.callRecords.map(cR => ({ ...cR })),
					textRecords: row.callRecords.map(tR => {
						let textRecord = {
							...tR,
							textId: textRecordIdSequence++,
							name: 'Bob',
						};
						delete textRecord.callId;
						return textRecord;
					}),
				}));
				this.setState({ rowData });
			}
		};

		this.gridApi.sizeColumnsToFit();
	}

	render() {
		return (
			<div
				className="ag-theme-balham"
				style={{
					height: '100vh',
				}}>
				<AgGridReact
					columnDefs={this.state.columnDefs}
					rowData={this.state.rowData}
					masterDetail={true}
					// detailCellRendererFramework={MyDetailCellRenderer}
					// detailCellRendererParams={{}}
					onGridReady={this.onGridReady.bind(this)}
					deltaRowDataMode={true}
					getRowNodeId={data => data.id}>
				</AgGridReact>
			</div >
		);
	}
}


export default App;