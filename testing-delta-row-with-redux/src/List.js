import React from 'react';
// import { Component } from 'react'

// class List extends Component {

//     render() {
//         return (
//             <ul>{this.props.values.map((val, ind) => <li key={ind}>{val}</li>)}</ul>
//         )
//     }

// }

// export default List


const list = props => (
    <ul>{props.values.map((val, ind) => <li key={ind}>{val}</li>)}</ul>
)

export default list 