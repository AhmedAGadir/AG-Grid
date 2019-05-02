'use strict';

import React, { Component } from 'react';
import { render } from 'react-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import refreshComponent from './Refresh.jsx';

class GridExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        { headerName: 'ID', field: 'id', width: 70 },
        { headerName: 'Username', field: 'username', width: 120 },
        { headerName: 'Name', field: 'name', width: 180 },
        { headerName: 'Email', field: 'email', width: 180 },
      ],
      rowData: [],
      sideBar: {
        toolPanels: [
          {
            id: 'refresh',
            labelDefault: 'Refresh',
            labelKey: 'customRefresh',
            iconKey: 'loading',
            toolPanel: 'refreshComponent',
            toolPanelParams: {
              // can pass any params here
              componentParent: this
            }
          },
        ],
      },
      statusBar: {
        statusPanels: [
          {
            statusPanel: 'refreshComponent',
            key: 'statusBarCompKey',
            statusPanelParams: {
              // can pass any params here
              componentParent: this
            }
          },
        ],
      },
      frameworkComponents: {
        refreshComponent: refreshComponent,
      },
    };
  }

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.refresh();
  };

  refresh = () => {
    // for request api
    let data = [
      {
        id: 1,
        name: 'Leanne Graham',
        username: 'Bret',
        email: 'Sincere@april.biz',
      },
      {
        id: 2,
        name: 'Ervin Howell',
        username: 'Antonette',
        email: 'Shanna@melissa.tv',
      },
      {
        id: 3,
        name: 'Clementine Bauch',
        username: 'Samantha',
        email: 'Nathan@yesenia.net',
      },
      {
        id: 4,
        name: 'Patricia Lebsack',
        username: 'Karianne',
        email: 'Julianne.OConner@kory.org',
      },
      {
        id: 5,
        name: 'Chelsey Dietrich',
        username: 'Kamren',
        email: 'Lucio_Hettinger@annie.ca',
      },
      {
        id: 6,
        name: 'Mrs. Dennis Schulist',
        username: 'Leopoldo_Corkery',
        email: 'Karley_Dach@jasper.info',
      },
      {
        id: 7,
        name: 'Kurtis Weissnat',
        username: 'Elwyn.Skiles',
        email: 'Telly.Hoeger@billy.biz',
      },
      {
        id: 8,
        name: 'Nicholas Runolfsdottir V',
        username: 'Maxime_Nienow',
        email: 'Sherwood@rosamond.me',
      },
      {
        id: 9,
        name: 'Glenna Reichert',
        username: 'Delphine',
        email: 'Chaim_McDermott@dana.io',
      },
      {
        id: 10,
        name: 'Clementina DuBuque',
        username: 'Moriah.Stanton',
        email: 'Rey.Padberg@karina.biz',
      },
    ];
    this.setState({
      rowData: data,
    });

    console.log('refresh');
  };

  render() {
    return (
      <div
        className="ag-theme-balham"
        style={{
          height: '100%',
        }}
      >
        <AgGridReact
          onGridReady={this.onGridReady}
          columnDefs={this.state.columnDefs}
          rowData={this.state.rowData}
          pagination={true}
          frameworkComponents={this.state.frameworkComponents}
          sideBar={this.state.sideBar}
          statusBar={this.state.statusBar}
        />
      </div>
    );
  }
}

render(<GridExample />, document.querySelector('#root'));
