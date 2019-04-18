import React, { Component } from 'react';

import Grid from './Grid';

const columns = [
    {
        field: 'orgName',
        headerName: 'Organisation Name'
    }
];

const fakeRows = [
    { orgName: 'Acme Construction Company' },
    { orgName: 'Payne, Bickers and Dogood Ltd.' },
    { orgName: 'Stn. Pendons Ltd.' },
    { orgName: 'V. Rich and Son' },
    { orgName: 'Doneys (Florence)' },
    { orgName: 'Mirage Land Co.' },
    { orgName: 'Arctic Geo. Lab. Co.' },
    { orgName: 'Liver Donors Inc.' },
    { orgName: 'World Wide Wine Corp.' },
    { orgName: 'Universal Amalgamations Ltd.' },
    { orgName: 'Consolidated Steel Co.' },
    { orgName: 'Micro Computer Inc.' },
    { orgName: 'Moonscape Products Ltd.' },
    { orgName: 'Rubber Goods Incorporated' },
    { orgName: 'D.Odgey Enterprises Ltd.' },
    { orgName: 'Money Factor Printers Ltd.' },
    { orgName: 'Better Plastics Corps.' },
    { orgName: 'D. Crepid Holdings' },
    { orgName: 'Super Big Ltd.' },
    { orgName: 'Space Propulsion Lab' },
    { orgName: 'Interstellar Travel Corp.' },
    { orgName: 'Dawking\'s Mining Co.' },
    { orgName: 'Lange and Sons (International)' },
    { orgName: 'Cooper\'s (Purveyors)' },
    { orgName: 'Dickinson Kincain Association' },
    { orgName: 'The All Enveloping Co. Ltd.' },
    { orgName: 'O. Verpaid Associates Ltd.' },
    { orgName: 'E. Normons and Sons' },
    { orgName: 'A. Maze and Lee' },
    { orgName: 'Huge Horace Mann and Yure Ltd.' },
    { orgName: 'R. Devious Inc.' },
    { orgName: 'Wakefeld and Daughter' },
    { orgName: 'Vast Holdings (Europe) Ltd.' },
    { orgName: 'Phil Thevich Consortium' },
    { orgName: 'Fastness and Vast Co. Ltd' },
    { orgName: 'Star Bright Merchandise Org.' },
    { orgName: 'X. Tortion World Wide Ltd.' },
    { orgName: 'Cartwright Tutorials' },
    { orgName: 'Black and White Picture Co. Ltd.' },
    { orgName: 'R. J. McArthur Parks Ltd.' },
    { orgName: 'Walker, Walker and Jones Bros.' },
    { orgName: 'Data Travel and Experiments' }
];

export default class Host extends Component {

    state = {
        error: undefined,
        loading: false,
        rows: []
    };

    componentDidMount() {
        this.runLoad();
    }

    runLoad = () => {
        console.log('runLoad')
        this.setState({
            loading: true,
            rows: null
        }, () => setTimeout(() => {
            console.log('runLoad callback')
            this.setState({
                rows: fakeRows,
                loading: false
            });
        }, 2500));
    };

    runError = () => {
        console.log('runError')
        this.setState({
            loading: true,
            rows: null
        }, () => setTimeout(() => {
            console.log('runError callback')
            this.setState({
                rows: [],
                loading: false,
                error: new Error('Something broke')
            });
        }, 2500));
    };

    render() {

        const { rows, loading, error } = this.state;

        return <div>
            <Grid rows={rows} columns={columns} loading={loading} error={error} />
            <button onClick={this.runLoad}>Load</button>
            <button onClick={this.runError}>Error</button>
        </div>;
    }
}
