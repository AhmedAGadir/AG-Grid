import React from 'react';
import { AgGridReact } from 'ag-grid-react';

const baseGridOptions = {
    columnDefs: [
        {
            headerName: 'Portfolio Type',
            field: 'PortfolioType'
        },
        {
            headerName: 'Purchased',
            field: 'Purchased'
        },
        {
            headerName: 'Limit',
            field: 'Limit',
            editable: true
        },
        {
            headerName: 'Consumed',
            field: 'Consumed'
        }
    ],
    deltaRowDataMode: true,
    getRowNodeId: data => data.id
};

class TestGrid extends React.Component {
    state = {
        data: []
    };

    componentDidMount() {
        setTimeout(() => {
            console.log('updating rowData')
            this.setState({
                data: [
                    {
                        PortfolioType: 'Gold',
                        Purchased: 100,
                        Limit: 75,
                        Consumed: 50,
                        id: 0
                    }
                ]
            });
        }, 3000);
    }

    render() {
        const gridOptions = {
            ...baseGridOptions,
            rowData: this.state.data
        };

        return (
            <div className="ag-theme-balham">
                <AgGridReact {...gridOptions} style={{ height: 400, width: 600 }} />
            </div>
        );
    }
}

export default TestGrid;