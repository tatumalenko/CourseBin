import React, { Component } from 'react';
import axios from 'axios';

class StudentForm extends Component {
    constructor() {


        super();

    }

    handleSubmit(event) {
        event.preventDefault();
        console.log('handleSubmit');
    }

    render() {

        return (

            <p>Hello</p>
        );
    }
}

export default StudentForm;
