import React, { Component } from 'react';

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            sport: ''
        }
    }

    submitHandler(event) {
        event.preventDefault();
        this.props.addAthlete({
            athlete: this.state.firstName + ' ' + this.state.lastName,
            sport: this.state.sport
        })
    }

    render() {
        return (
            <form class="form-horizontal" id="myForm" onSubmit={this.submitHandler.bind(this)}>
                <div class="form-group">
                    <label for="firstName" class="col-sm-2 control-label">First Name</label>
                    <div class="col-sm-10">
                        <input
                            type="text"
                            name="firstName"
                            class="form-control"
                            placeholder="Michael"
                            value={this.state.firstName}
                            onInput={e => this.setState({ firstName: e.target.value })} />
                    </div>
                </div>
                <div class="form-group">
                    <label for="lastName" class="col-sm-2 control-label">Last Name</label>
                    <div class="col-sm-10">
                        <input
                            type="text"
                            name="lastName"
                            class="form-control"
                            placeholder="Phelps"
                            value={this.state.lastName}
                            onInput={e => this.setState({ lastName: e.target.value })} />
                    </div>
                </div>
                <div class="form-group">
                    <label for="sport" class="col-sm-2 control-label">Sport</label>
                    <div class="col-sm-10">
                        <input
                            type="text"
                            name="sport"
                            class="form-control"
                            placeholder="Swimming"
                            value={this.state.sport}
                            onInput={e => this.setState({ sport: e.target.value })} />
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-offset-2 col-sm-10">
                        <button type="submit" class="btn btn-primary">Add Athlete</button>
                    </div>
                </div>
            </form>
        )
    }
}

export default Form;