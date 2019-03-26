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
				{ field: 'years', enableRowGroup: true },
				{ field: 'rowNumber' },
				{ field: 'text', editable: true }
			],
			defaultColDef: {
				width: 150,
			},
			originalRowData: null,
			rowData: null,
		}
		this.idSequence = 0;
		this.editingFromCellValueChanged = false;
	}

	componentDidMount() {
		const rowData = data.map(row => ({
			...row,
			countries: [...row.countries],
			years: [...row.years],
			id: this.idSequence++,
		}));

		this.setState({
			originalRowData: rowData,
			rowData: rowData
		});
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
			const groupingBy = params.columns.map(col => col.colId);
			const updatedRows = [];

			this.state.originalRowData.forEach(row => {
				recursiveFunc.call(this, row);
			})

			function recursiveFunc(row, stack = [], ind = 0) {
				row[groupingBy[ind]].forEach(groupItem => {
					let newStack = [...stack, groupItem];
					if (ind === groupingBy.length - 1) {
						addNewRow.call(this, row, newStack);
						return;
					}
					recursiveFunc.call(this, row, newStack, ind + 1);
				})
			}

			function addNewRow(row, stack) {
				let newRow = {
					...row,
					id: this.idSequence++
				}
				groupingBy.forEach((group, ind) => {
					newRow[group] = stack[ind];
				})
				updatedRows.push(newRow);
			}

			this.setState({ rowData: updatedRows });
			params.api.expandAll();
		} else {
			this.setState(prevState => ({ rowData: prevState.originalRowData }));
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
			years: [row.years],
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
