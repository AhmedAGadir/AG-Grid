import React, {Component} from 'react';

export default class GroupRowInnerRenderer extends Component {
    constructor(props) {
        super(props);

        props.reactContainer.style.display = "inline-block";

        this.props = props;

        const node = this.props.node;
        const aggData = node.aggData;
        let flagCode = this.props.flagCodes[node.key];

        this.state = {
            flagCode,
            flagCodeImg: `https://flags.fmcdn.net/data/flags/mini/${flagCode}.png`,
            countryName: node.key,
            goldCount: aggData.gold,
            silverCount: aggData.silver,
            bronzeCount: aggData.bronze,
        };

        this.dataChangedListener = () => {
            this.refreshUi();
        };

        props.api.addEventListener('cellValueChanged', this.dataChangedListener);
        props.api.addEventListener('filterChanged', this.dataChangedListener);
    }

    refreshUi() {
        const node = this.props.node;
        const aggData = node.aggData;
        let flagCode = this.props.flagCodes[node.key];
        this.setState({
            flagCode,
            flagCodeImg: `https://flags.fmcdn.net/data/flags/mini/${flagCode}.png`,
            countryName: node.key,
            goldCount: aggData.gold,
            silverCount: aggData.silver,
            bronzeCount: aggData.bronze,
        });
    }

    render() {
        let img = '';
        if(this.state.flagCode) {
            img = <img className="flag" border="0" width="20" height="15" src={this.state.flagCodeImg}/>
        }

        return (
            <div style={{display: "inline-block"}}>
                { img }
                <span className="groupTitle"> {this.state.countryName}</span>
                <span className="medal gold"> Gold: {this.state.goldCount}</span>
                <span className="medal silver"> Silver: {this.state.silverCount}</span>
                <span className="medal bronze"> Bronze: {this.state.bronzeCount}</span>
            </div>
        );
    }

    componentWillUnmount() {
        this.props.api.removeEventListener('cellValueChanged', this.dataChangedListener);
        this.props.api.removeEventListener('filterChanged', this.dataChangedListener);
    }
};
