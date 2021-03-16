'use strict';

// import React, { useState } from 'react';
import { render } from 'react-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import React, { useState, useEffect, useMemo } from 'react';
// import { ColDef, RowNode } from 'ag-grid-community';
// import { useGridReady } from './hooks/useGridReady';
// import { AnyArrayOrNull, StringArrayOrNull } from './types/commonTypes';
// import { Message } from 'src/components/Message';
// import { Grid } from 'src/components/Grid';
// import './WeightedRanksSummary.scss';

// const GridExample = () => {
  // type WeightedRanksSummaryProps = {
  //   rowData: AnyArrayOrNull,
  //   footerData: AnyArrayOrNull,
  //   colDefs: ColDef[],
  //   showTotal: boolean,
  //   groupByIds: StringArrayOrNull,
  //   groupLeaf: string | null,
  // };

  
const App = () => {
const [groupLeaf, setGroupLeaf] = useState('country');

  const ROW_DATA = [
    { "athlete":"Alicia Coutts","age":24,"country":"Australia","year":2012,"date":"12/08/2012","sport":"Swimming","gold":1,"silver":3,"bronze":1,"total":5},{"athlete":"Missy Franklin","age":17,"country":"United States","year":2012,"date":"12/08/2012","sport":"Swimming","gold":4,"silver":0,"bronze":1,"total":5},{"athlete":"Ryan Lochte","age":27,"country":"United States","year":2012,"date":"12/08/2012","sport":"Swimming","gold":2,"silver":2,"bronze":1,"total":5},{"athlete":"Allison Schmitt","age":22,"country":"United States","year":2012,"date":"12/08/2012","sport":"Swimming","gold":3,"silver":1,"bronze":1,"total":5},{"athlete":"Natalie Coughlin","age":21,"country":"United States","year":2004,"date":"29/08/2004","sport":"Swimming","gold":2,"silver":2,"bronze":1,"total":5},{"athlete":"Ian Thorpe","age":17,"country":"Australia","year":2000,"date":"01/10/2000","sport":"Swimming","gold":3,"silver":2,"bronze":0,"total":5},{"athlete":"Dara Torres","age":33,"country":"United States","year":2000,"date":"01/10/2000","sport":"Swimming","gold":2,"silver":0,"bronze":3,"total":5},{"athlete":"Cindy Klassen","age":26,"country":"Canada","year":2006,"date":"26/02/2006","sport":"Speed Skating","gold":1,"silver":2,"bronze":2,"total":5},{"athlete":"Nastia Liukin","age":18,"country":"United States","year":2008,"date":"24/08/2008","sport":"Gymnastics","gold":1,"silver":3,"bronze":1,"total":5},{"athlete":"Marit Bjørgen","age":29,"country":"Norway","year":2010,"date":"28/02/2010","sport":"Cross Country Skiing","gold":3,"silver":1,"bronze":1,"total":5}
  ]
  const FOOTER_DATA = [
    {"athlete":"Sun Yang","age":20,"country":"China","year":2012,"date":"12/08/2012","sport":"Swimming","gold":2,"silver":1,"bronze":1,"total":4},{"athlete":"Kirsty Coventry","age":24,"country":"Zimbabwe","year":2008,"date":"24/08/2008","sport":"Swimming","gold":1,"silver":3,"bronze":0,"total":4},
  ]
  const COL_DEFS = [
    { field: 'athlete', minWidth: 150 },
    { field: 'age', maxWidth: 90 },
    { field: 'country', rowGroup: true, minWidth: 150 },
    { field: 'year', maxWidth: 90 },
    { field: 'date', minWidth: 150 },
    { field: 'sport', minWidth: 150 },
    { field: 'gold' },
    { field: 'silver' },
    { field: 'bronze' },
    { field: 'total' },
  ]
  const GROUP_IDS = ['country']
  const SHOW_TOTAL = true;

  return (
    <div>
    <button onClick={() => setGroupLeaf(groupLeaf === 'athlete' ? 'country' : 'athlete')}>update group leaf</button>
    <GridExample 
      rowData={ROW_DATA}
      footerData={FOOTER_DATA}
      colDefs={COL_DEFS}
      showTotal={SHOW_TOTAL}
      groupByIds={GROUP_IDS}
      groupLeaf={groupLeaf}
    />
    </div>
  )

  }

  const GridExample = ({
    rowData,
    footerData,
    colDefs,
    showTotal,
    groupByIds,
    groupLeaf,
  }) => {
    const [gridApi, setGridApi] = useState(null);
    // const { onGridReady, gridApi } = useGridReady();

    useEffect(() => {
      if (gridApi) {
        if (showTotal) {
          if (footerData && groupByIds && groupByIds.length > 0) {
            // filter colDefs for the group id
            const totalRow = footerData[0];
            groupByIds.forEach((g) => {
              totalRow[g] = 'Total';
            });
            gridApi.setPinnedBottomRowData([totalRow]);
          }
        } else {
          gridApi.setPinnedBottomRowData([]);
        }
      }
    }, [gridApi, showTotal, groupByIds, footerData]);

    const autoGroupColDef = useMemo(() => {
        console.log('groupLeaf at useMemo Summary', groupLeaf);
        return {
          colId: groupLeaf ? groupLeaf : '',
          //headerName: groupLeaf ? groupLeaf : '',
          valueGetter: (params) => {
            console.log('groupLeaf at valuegetter', groupLeaf);
            //console.log('params.data', params.data);
            return groupLeaf ? params.data[groupLeaf] : 'test';
          },
          minWidth: 200,
          cellRenderer: 'agGroupCellRenderer',
          cellRendererParams: {
            padding: 20,
            suppressCount: false,
          },
        };
      },
      [groupLeaf]);

    const onGridReady = params => {
      setGridApi(params.api);
    }

    if (!rowData || rowData.length == 0) {
      return (
        <div>No Ranks</div>
      );
    }

    const onGridChange = () => {
      if (gridApi) {
        gridApi.sizeColumnsToFit();
      }
    };

    return (
      <div className="esg-rank-summary ag-theme-alpine" style={{height: '90vh'}} data-testid="weighted-rank-summary">
        <AgGridReact
          defaultColDef={{
            sortable: true,
            resizable: true,
          }}
          autoGroupColumnDef={autoGroupColDef}
          defaultGroupSortComparator={(nodeA, nodeB) => {
            if (nodeA.key < nodeB.key) {
              return -1;
            } else if (nodeA.key > nodeB.key) {
              return 1;
            } else {
              return 0;
            }
          }}
          rowClassRules={{
            'group-row': (params) => params.node.group,
            'pinned-row': (params) => params.node.rowPinned,
          }}
          rowData={rowData}
          animateRows={true}
          // rowHeight={30}
          // headerHeight={34.5}
          // deltaColumnMode={true} 
          columnDefs={colDefs}
          enableRangeSelection={true}
          onGridReady={onGridReady}
          onGridSizeChanged={onGridChange}
          onGridColumnsChanged={onGridChange}
          pinnedBottomRowData={undefined}
          suppressAggFuncInHeader={true}
          groupDefaultExpanded={-1}
        />
      </div>
    );
  }

render(<App></App>, document.querySelector('#root'));
