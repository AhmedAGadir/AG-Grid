'use strict';

import React, { Component } from 'react';
import { render } from 'react-dom';
import { AgGridReact } from 'ag-grid-react';

class ThisThing extends React.Component {
    render() {
        return <div> Some thing </div>;
    }
}

class TryGrid extends React.Component {
    render() {
        return (
            <div
                style={{
                    height: 350,
                    width: '100%',
                }}
                className="ag-theme-balham"
            >
                <AgGridReact
                    rowData={[
                        {
                            name: 'Matthew',
                            pizza: 'Pepperoni',
                        },
                        {
                            name: 'Mark',
                            pizza: 'Cheese',
                        },
                        {
                            name: 'Luke',
                            pizza: 'Cheese',
                        },
                        {
                            name: 'John',
                            pizza: 'Pepperoni',
                        },
                    ]}
                    columnDefs={[
                        {
                            headerName: 'First Name',
                            field: 'name',
                        },
                        {
                            headerName: 'Pizza',
                            field: 'pizza',
                        },
                        {
                            headerName: 'Custom',
                            field: 'pizza',
                            cellRendererFramework: ThisThing,
                        },
                    ]}
                />{' '}
            </div>
        );
    }
}

render(<TryGrid />, document.querySelector('#root'));
