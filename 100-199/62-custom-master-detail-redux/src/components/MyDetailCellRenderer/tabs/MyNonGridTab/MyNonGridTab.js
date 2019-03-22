import React from 'react';
import './myNonGridTab.css';

const myNonGridTab = props => {

    let onImgLoad = (event, props) => {
        let imgHeight = event.target.height
        let offset = 60; // 15px padding + 15px padding + 30px button row height
        props.setDetailRowHeight(imgHeight + offset)
    }

    return (
        <div className="non-grid-tab-container">
            <img src={props.imgUrl} onLoad={e => onImgLoad(e, props)} alt="grid-product"/>
            <div>
                <h3>{props.imgTitle}</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi illo velit explicabo quia magni numquam quas. Iste a dolorum quasi provident in blanditiis quia corrupti illum non expedita? Placeat, praesentium!</p>
            </div>
        </div>
    );
}

export default myNonGridTab;