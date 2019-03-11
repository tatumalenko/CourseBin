import React, { Component } from 'react';
//import Button from 'react-bootstrap';

class StudentForm extends Component {
    constructor() {
        super();

        const jsonObject = {
            "fall": {
                requestedCourses: [],
                term: "FALL",
                eveningTimePreference: false,
                numberOfCourses: 1,
            },

            "winter": {
                requestedCourses: [],
                term: "WINTER",
                eveningTimePreference: false,
                numberOfCourses: 1,
            },

            "summer": {
                requestedCourses: [],
                term: "SUMMER",
                eveningTimePreference: false,
                numberOfCourses: 1,
            }
        };

        this.state = {
            jsonObject,
            fallChecked: false,
            winterChecked: false,
            summerChecked: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.toggleSemesterSection = this.toggleSemesterSection.bind(this);
    }

    handleSubmit() {
        console.log("form submitted");
    }

    handleChange(event) {
        event.preventDefault();
        this.setState({
            [event.target.name]: event.target.value,
        });

        console.log(event.target.value);
    }

    toggleSemesterSection(season, toggle) {
        switch (season) {
            case 'fall':
                this.setState({
                    fallChecked: !toggle
                })
                break;
            case 'winter': this.state =
                this.setState({
                    winterChecked: !toggle
                })
                break;
            case 'summer': this.state =
                this.setState({
                    summerChecked: !toggle
                })
                break;
        }

        console.log(season + " " + toggle);
    }



    render() {
        const { fallChecked, summerChecked, winterChecked, jsonObject } = this.state;


        return (

            <div className="student-form">
                <div className="title-wrapper">
                    <h3>Coursebin</h3>
                </div>
                <form onSubmit={this.handleSubmit}>

                    {fallChecked ?
                        <div className="semester-form-component">
                            <li onClick={() => this.toggleSemesterSection('fall', fallChecked)}>Collapse</li>
                            <div className="form-group">
                                <label id="checkbox">Prefer evening classes? <input type="checkbox" /></label>
                                <br />
                                <label>Please choose how many courses you prefer to take in this semester
                                </label>
                                <br />

                            </div>
                        </div> :

                        <div className="semester-form-component">
                            <li onClick={() => this.toggleSemesterSection('fall', fallChecked)}>Plan Your Fall Semester</li>
                        </div>
                    }

                    {winterChecked ?
                        <div className="semester-form-component">
                            <li onClick={() => this.toggleSemesterSection('winter', winterChecked)}> Collapse </li>
                        </div> :
                        <div className="semester-form-component">
                            <li onClick={() => this.toggleSemesterSection('winter', winterChecked)}> Plan Your Winter Semester</li>
                        </div>
                    }

                    {summerChecked ?
                        <div className="semester-form-component">
                            <li onClick={() => this.toggleSemesterSection('summer', summerChecked)}> Collapse </li>
                        </div> :
                        <div className="semester-form-component">
                            <li onClick={() => this.toggleSemesterSection('summer', summerChecked)}> Plan Your Summer Semester </li>
                        </div>
                    }



                    <input type="submit" value="Submit" />
                </form>
            </div >

        );
    }
}

export default StudentForm;
