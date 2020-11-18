'use strict';

import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { AgGridReact, AgGridColumn } from '@ag-grid-community/react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-alpine.css';

const buildAnimal = (id, animal, size) => ({
  id,
  animal,
  size,
});

const defaultRowData = [
  buildAnimal(1, 'Dog', 51),
  buildAnimal(2, 'Cat', 23),
  buildAnimal(3, 'Fly', 56),
  buildAnimal(4, 'Giraffe', 64),
  buildAnimal(5, 'Snake', 6),
  buildAnimal(6, 'Salmom', 78),
  buildAnimal(7, 'Donkey', 10),
];

const GridExample = () => {
  const [rowData, setRowData] = useState(defaultRowData);
  const [gridApi, setGridApi] = useState(null);

  const [selectedNodeIds, setSelectedNodeIds] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
  });

  useEffect(() => {
    if (!gridApi) {
      return;
    }
    console.log('setting node selection according to selectedNodeIds')
    gridApi.forEachNode((node) => {
      node.setSelected(selectedNodeIds[node.id]);
    });
  }, [rowData]);

  useEffect(() => {
    console.log('selectedNodeIds changed', selectedNodeIds);
  }, [selectedNodeIds]);

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const filterChanged = (sizeLimit) => {
    const newData = defaultRowData.filter((data) => data.size <= sizeLimit);
    console.log('setting new data');
    setRowData(newData);
  };

  const onSelectionChanged = (event) => {
    console.log('onSelectionChanged');
    let updatedSelectedNodeIds = { ...selectedNodeIds };
    gridApi.forEachNode(
      (node) => (updatedSelectedNodeIds[node.data.id] = node.selected)
    );
    setSelectedNodeIds(updatedSelectedNodeIds);
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div className="test-container">
        <div className="test-header">
          <label>
            <input
              type="radio"
              name="filter"
              onChange={() => filterChanged(100)}
            />
            Up to 100
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              onChange={() => filterChanged(50)}
            />
            Up to 50
          </label>
        </div>
        <div
          id="myGrid"
          style={{
            height: '100%',
            width: '100%',
          }}
          className="ag-theme-alpine"
        >
          <AgGridReact
            modules={AllCommunityModules}
            onGridReady={onGridReady}
            rowSelection={'multiple'}
            defaultColDef={{
              flex: 1,
            }}
            rowData={rowData}
            immutableData
            getRowNodeId={(node) => node.id}
            onSelectionChanged={onSelectionChanged}
            columnDefs={[
              {
                checkboxSelection: true,
                headerCheckboxSelection: true,
              },
              {
                headerName: 'Animal',
                field: 'animal',
              },
              {
                headerName: 'Size',
                field: 'size',
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

render(<GridExample></GridExample>, document.querySelector('#root'));
