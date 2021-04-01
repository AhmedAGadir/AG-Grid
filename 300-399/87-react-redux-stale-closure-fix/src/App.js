import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector, useDispatch, useStore } from 'react-redux'
import './App.css';
import allActions from './actions'
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';


const App = () => {
  const greetings = useSelector(state => state.greetings);
  const language = useSelector(state => state.language);
  const store = useStore();

  const dispatch = useDispatch()

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const updateLanguage = lang => {
    dispatch(allActions.languageActions.setLanguage(lang))
  }

  const clickHandler = useCallback(() => {
    let language = store.getState().language;
    let greetings = store.getState().greetings;
    alert(greetings[language]);
  }, [language]);

  return (
    <div className="App">
      <button onClick={() => updateLanguage('arabic')}>[Arabic]</button>
      <button onClick={() => updateLanguage('english')}>[English]</button>
      <button onClick={clickHandler}> Greet</button>
      <h1>Selected language is: {language}</h1>
      <div style={{ width: '100%', height: '100%' }}>
        <div className="example-wrapper">
          <div
            id="myGrid"
            style={{
              height: '100vh',
              width: '100%',
            }}
            className="ag-theme-alpine"
          >
            <AgGridReact
              rowData={[
                {
                  orgHierarchy: ['Erica Rogers'],
                  jobTitle: 'CEO',
                  employmentType: 'Permanent',
                },
                {
                  orgHierarchy: ['Erica Rogers', 'Malcolm Barrett'],
                  jobTitle: 'Exec. Vice President',
                  employmentType: 'Permanent',
                },
                {
                  orgHierarchy: [
                    'Erica Rogers',
                    'Malcolm Barrett',
                    'Esther Baker',
                  ],
                  jobTitle: 'Director of Operations',
                  employmentType: 'Permanent',
                },
                {
                  orgHierarchy: [
                    'Erica Rogers',
                    'Malcolm Barrett',
                    'Esther Baker',
                    'Brittany Hanson',
                  ],
                  jobTitle: 'Fleet Coordinator',
                  employmentType: 'Permanent',
                },
                {
                  orgHierarchy: [
                    'Erica Rogers',
                    'Malcolm Barrett',
                    'Esther Baker',
                    'Brittany Hanson',
                    'Leah Flowers',
                  ],
                  jobTitle: 'Parts Technician',
                  employmentType: 'Contract',
                },
                {
                  orgHierarchy: [
                    'Erica Rogers',
                    'Malcolm Barrett',
                    'Esther Baker',
                    'Brittany Hanson',
                    'Tammy Sutton',
                  ],
                  jobTitle: 'Service Technician',
                  employmentType: 'Contract',
                },
                {
                  orgHierarchy: [
                    'Erica Rogers',
                    'Malcolm Barrett',
                    'Esther Baker',
                    'Derek Paul',
                  ],
                  jobTitle: 'Inventory Control',
                  employmentType: 'Permanent',
                },
                {
                  orgHierarchy: [
                    'Erica Rogers',
                    'Malcolm Barrett',
                    'Francis Strickland',
                  ],
                  jobTitle: 'VP Sales',
                  employmentType: 'Permanent',
                },
                {
                  orgHierarchy: [
                    'Erica Rogers',
                    'Malcolm Barrett',
                    'Francis Strickland',
                    'Morris Hanson',
                  ],
                  jobTitle: 'Sales Manager',
                  employmentType: 'Permanent',
                },
                {
                  orgHierarchy: [
                    'Erica Rogers',
                    'Malcolm Barrett',
                    'Francis Strickland',
                    'Todd Tyler',
                  ],
                  jobTitle: 'Sales Executive',
                  employmentType: 'Contract',
                },
                {
                  orgHierarchy: [
                    'Erica Rogers',
                    'Malcolm Barrett',
                    'Francis Strickland',
                    'Bennie Wise',
                  ],
                  jobTitle: 'Sales Executive',
                  employmentType: 'Contract',
                },
                {
                  orgHierarchy: [
                    'Erica Rogers',
                    'Malcolm Barrett',
                    'Francis Strickland',
                    'Joel Cooper',
                  ],
                  jobTitle: 'Sales Executive',
                  employmentType: 'Permanent',
                },
              ]}
              defaultColDef={{ flex: 1 }}
              autoGroupColumnDef={{
                headerName: 'Organisation Hierarchy',
                minWidth: 300,
                cellRenderer: 'myCellRenderer',
                cellRendererParams: {
                  clicked: clickHandler
                }
              }}
              treeData={true}
              animateRows={true}
              groupDefaultExpanded={-1}
              getDataPath={function (data) {
                return data.orgHierarchy;
              }}
              onGridReady={onGridReady}
              frameworkComponents={{
                myCellRenderer: MyCellRenderer
              }}
            >
              <AgGridColumn field="jobTitle" cellRenderer='myCellRenderer' cellRendererParams={{ clicked: clickHandler }} />
              <AgGridColumn field="employmentType" />
            </AgGridReact>
          </div>
        </div>
      </div>
    </div>
  );
}

const MyCellRenderer = props => (
  <div>
    <span>{props.value}</span>
    <button onClick={() => props.clicked()}>click me</button>
  </div>
)

export default App;
