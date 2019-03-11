import React, { Component } from 'react';

class StudentForm extends Component {
    constructor() {
        super();
        this.state = {
            fallCheckbox: false,
            winterCheckbox: false,
            summerCheckbox: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit() {
        console.log("form submitted");
    }

    handleChange(event, arg) {
        this.setState({
            [event.target.name]: event.target.value,
        });

        console.log(event.target.value);
    }

    render() {

        return (

            <div className="student-form">
                <div className="title-wrapper">
                    <h3>Coursebin</h3>
                </div>
                <form onSubmit={this.handleSubmit}>

                    <label onClick={this.handleChange('F')}>Fall</label>
                    <div className="semester-form-component">

                    </div>

                    <label onClick={this.handleChange('W')}>Winter</label>
                    <div className="semester-form-component">

                    </div>

                    <label onClick={this.handleChange('S')}>Summer</label>
                    <div className="semester-form-component">
                    </div>

                    <input type="submit" value="Submit" />
                </form>
            </div>

        );
    }
}

export default StudentForm;
