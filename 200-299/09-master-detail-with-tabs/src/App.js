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
			rowData: [
				{
					"lineNumber": 1,
					"id": uuidv4(),
					"custID": "test",
					"custSlang": "test",
					"custName": "test",
					"status": "A",
					"deskID": "test",
					"gfcID": "00000",
					"gpID": "00000",
					"accountType": "test",
					"contacts": [
						{
							"id": uuidv4(),
							"custID": "testid",
							"custType": "test",
							"lastName": "test",
							"firstName": "test",
							"email": " ",
							"phone": "404-842-2414",
							"fax": "",
							"street": "3",
							"city": "",
							"state": "",
							"country": "USA",
							"postalCode": "",
							"notes": "this is a test note"
						}
					],
					"profileRespApis": [
						{
							"id": uuidv4(),
							"profileName": "test",
							"dValue": "q",
							"dValues": 1,
							"description": "test"
						},
						{
							"id": uuidv4(),
							"profileName": "test",
							"dValue": "q",
							"dValues": 2,
							"description": "test"
						}
					]
				},
				{
					"lineNumber": 2,
					"id": uuidv4(),
					"custID": "test",
					"custSlang": "test",
					"custName": "test",
					"status": "B",
					"deskID": "test",
					"gfcID": "00000",
					"gpID": "00000",
					"accountType": "test",
					"contacts": [
						{
							"id": uuidv4(),
							"custID": "testid",
							"custType": "test",
							"lastName": "test",
							"firstName": "test",
							"email": " ",
							"phone": "404-842-2414",
							"fax": "",
							"street": "3",
							"city": "",
							"state": "",
							"country": "USA",
							"postalCode": "",
							"notes": "this is a test note"
						}
					],
					"profileRespApis": [
						{
							"id": uuidv4(),
							"profileName": "test",
							"dValue": "q",
							"dValues": 3,
							"description": "test"
						},
						{
							"id": uuidv4(),
							"profileName": "test",
							"dValue": "q",
							"dValues": 4,
							"description": "test"
						}
					]
				}
			]
		}
	}

	onGridReady(params) {
		this.gridApi = params.api;
		this.gridColumnApi = params.columnApi;

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
					columnDefs={[
						{ field: "lineNumber", cellRenderer: 'agGroupCellRenderer' },
						{ field: "custID" },
						{ field: "custSlang" },
						{ field: "custName" },
						{ field: "status" },
						{ field: "deskID" },
						{ field: "gfcID" },
						{ field: "gpID" },
						{ field: "accountType" },
					]}
					rowData={this.state.rowData}
					defaultColDef={{ width: 150 }}
					masterDetail={true}
					detailCellRendererFramework={MyDetailCellRenderer}
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