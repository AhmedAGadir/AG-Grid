"use strict";

import React, { Component } from "react";
import { render } from "react-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import data from './rowData.js';

class GridExample extends Component {
	constructor(props) {
		super(props);
		this.state = {
			columnDefs: [
				{ field: 'countries', enableRowGroup: true },
				{ field: 'rowNumber' },
				{ field: 'text', editable: true }
			],
			defaultColDef: {
				width: 150,
			},
			rowData: null
		}
		this.idSequence = 0;
		this.editingFromCellValueChanged = false;
	}

	componentDidMount() {
		const rowData = data.map(row => ({
			...row,
			countries: [...row.countries],
			id: this.idSequence++,
		}));

		this.setState({ rowData });
	}

	onGridReady(params) {
		this.gridApi = params.api;
		this.gridColumnApi = params.columnApi;
	};

	getRowNodeId(data) {
		return data.id;
	}

	onColumnRowGroupChanged(params) {
		const isGrouping = params.columns.length > 0;

		if (isGrouping) {
			if (params.columns[0].colId === 'countries') {
				const updatedRows = [];
				this.state.rowData.forEach(row => {
					row.countries.forEach(country => {
						updatedRows.push({
							...row,
							id: this.idSequence++,
							countries: country
						})
					})
				});
				this.setState({ rowData: updatedRows });
			}
			params.api.expandAll();
		} else {
			const updatedRows = [];
			this.state.rowData.forEach(row => {
				const ind = updatedRows.findIndex(updatedRow => updatedRow.rowNumber === row.rowNumber);
				if (ind === -1) {
					updatedRows.push({
						...row,
						id: this.idSequence++,
						countries: [row.countries]
					});
				} else {
					updatedRows[ind].countries.push(row.countries);
				}
			});
			this.setState({ rowData: updatedRows });
		}
	}

	onCellValueChanged(params) {
		const isGrouping = params.columnApi.getRowGroupColumns().length > 0;
		if (!isGrouping || this.editingFromCellValueChanged) {
			return
		}

		const updatedRows = this.state.rowData.map(row => ({
			...row,
			countries: [row.countries],
			text: row.rowNumber === params.data.rowNumber ? params.newValue : row.text
		}));

		this.editingFromCellValueChanged = true;
		this.setState({ rowData: updatedRows });
		setTimeout(() => this.editingFromCellValueChanged = false, 0);
	}

	render() {
		return (
			<div style={{ width: "100%", height: "100%" }}>
				<div style={{ height: "100%", boxSizing: "border-box" }}>
					<div
						id="myGrid"
						style={{
							height: "100%",
							width: "100%"
						}}
						className="ag-theme-balham"
					>
						<AgGridReact
							columnDefs={this.state.columnDefs}
							defaultColDef={this.state.defaultColDef}
							rowData={this.state.rowData}
							sideBar={true}
							rowGroupPanelShow='always'
							onColumnRowGroupChanged={this.onColumnRowGroupChanged.bind(this)}
							onGridReady={this.onGridReady.bind(this)}
							deltaRowDataMode={true}
							getRowNodeId={this.getRowNodeId}
							onCellValueChanged={this.onCellValueChanged.bind(this)}
						/>
					</div>
				</div>
			</div>
		);
	}
}
render(<GridExample />, document.querySelector("#root"));
