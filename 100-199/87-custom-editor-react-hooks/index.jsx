"use strict";

import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";

const AthleteCellEditor = props => {
	const [value, setValue] = useState(props.value);

	return (
		<input
			type="text"
			className='ag-cell-edit-input'
			value={value}
			onInput={event => setValue(event.target.value)} />
	)
}

const GridExample = props => {
	const [columnDefs, setColumnDefs] = useState([
		{
			field: "athlete",
			cellEditor: 'athleteCellEditor'
		},
	]);
	const [rowData, setRowData] = useState(null);
	const [gridApi, setGridApi] = useState(null);
	const [columnApi, setColumnApi] = useState(null);

	const onGridReady = params => {
		setGridApi(params.api);
		setColumnApi(params.columnApi);

		fetch("https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json")
			.then(res => res.json())
			.then(data => {
				setRowData(data);
			});
	}

	return (
		<div style={{ width: "100%", height: "100%" }}>
			<div
				id="myGrid"
				style={{ height: "100%", width: "100%" }}
				className="ag-theme-balham">
				<AgGridReact
					columnDefs={columnDefs}
					defaultColDef={{
						editable: true
					}}
					rowData={rowData}
					onGridReady={onGridReady}
					frameworkComponents={{
						athleteCellEditor: AthleteCellEditor
					}}
				/>
			</div>
		</div>
	)
}

render(<GridExample />, document.querySelector("#root"));
