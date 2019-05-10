import React, { Component } from 'react';

const NAMES = ['Ernie', 'Ellis', 'Rafael', 'Timmy', 'Carmelo', 'Mohamed', 'Neal', 'Rodney', 'Rickey', 'Harris', 'Aldo', 'Darell', 'Britt', 'Pasquale', 'Ellsworth', 'Cameron', 'Geoffrey', 'Monty', 'Damon', 'Jamel'];

class NameCellRenderer extends Component {

    changeNameHandler() {
        let newName = NAMES[Math.floor(Math.random() * NAMES.length)];
        this.props.changeName(newName, this.props.rowIndex);
    }

    render() {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{this.props.value}</span>
                <button onClick={this.changeNameHandler.bind(this)}>Change</button>
            </div>
        )
    }
}

export default NameCellRenderer;