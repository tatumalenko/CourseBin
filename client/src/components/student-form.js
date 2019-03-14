/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable prefer-destructuring */
import React, { Component } from 'react';
import {
  Form, Row, Col, Button,
} from 'react-bootstrap';

class StudentForm extends Component {
  constructor() {
    super();

    const jsonObject = {
      fall: {
        requestedCourses: [],
        term: 'FALL',
        eveningTimePreference: false,
        numberOfCourses: 1,
      },

      winter: {
        requestedCourses: [],
        term: 'WINTER',
        eveningTimePreference: false,
        numberOfCourses: 1,
      },

      summer: {
        requestedCourses: [],
        term: 'SUMMER',
        eveningTimePreference: false,
        numberOfCourses: 1,
      },
    };

    this.state = {
      jsonObject,
      fallChecked: false,
      winterChecked: false,
      summerChecked: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggleSemesterSection = this.toggleSemesterSection.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    });
  }


  handleCheckboxChange(event) {
    const target = event.target;
    const checked = target.checked;
    const name = target.name;
    this.setState({
      [name]: checked,
    });
  }


  toggleSemesterSection(season, toggle) {
    switch (season) {
      case 'fall':
        this.setState({
          fallChecked: !toggle,
        });
        break;
      case 'winter':
        this.setState({
          winterChecked: !toggle,
        });
        break;
      case 'summer':
        this.setState({
          summerChecked: !toggle,
        });
        break;
      default:
    }
  }


  render() {
    const {
      fallChecked, summerChecked, winterChecked, jsonObject,
    } = this.state;

    return (

            <div className='student-form'>
                <h3>Coursebin</h3>
                <Form onSubmit={this.handleSubmit}>

                    <div id='student-form-content'>
                        <div style={{ display: fallChecked ? 'initial' : 'none' }}>
                            <Form.Group as={Row} className='semester-form-component'>
                                <Col xs={3} />
                                <Col xs={6} className='form-section-content'>
                                    <Form.Label column cs='12' className='season' onClick={() => this.toggleSemesterSection('fall', fallChecked)}>
                                        Fall
                                    <i className='material-icons'>
                                            minimize
                                    </i>

                                    </Form.Label>

                                    <Form.Label column xs='12'>
                                        Do you prefer evening classes?
                                    <Form.Check
                                            type='checkbox'
                                            name='jsonObject.fall.eveningTimePreference'
                                            onChange={this.handleCheckboxChange}
                                            inline
                                    />
                                    </Form.Label>

                                    <div className='number-courses'>
                                        <Form.Label>
                                            How many courses do you prefer to take per semester?
                                        </Form.Label>

                                        <Form.Control column xs={3} model={jsonObject.fall.numberOfCourses} name='jsonObject.fall.numberOfCourses' onChange={this.handleChange} as='select'>
                                            <option value={1}>1</option>
                                            <option value={2}>2</option>
                                            <option value={3}>3</option>
                                            <option value={4}>4</option>
                                            <option value={5}>5</option>
                                        </Form.Control>
                                    </div>

                                </Col>
                                <Col xs={3} />
                            </Form.Group>
                        </div>
                        <div style={{ display: fallChecked ? 'none' : 'initial' }}>
                            <Form.Group as={Row} className='semester-form-component'>
                                <Col xs={3} />
                                <Col xs={6}>
                                    <Form.Label className='season' onClick={() => this.toggleSemesterSection('fall', fallChecked)}>
                                        Fall
                                    <i className='material-icons'>
                                            add
                                    </i>
                                    </Form.Label>
                                </Col>
                            </Form.Group>
                        </div>


                        <div style={{ display: winterChecked ? 'initial' : 'none' }}>
                            <Form.Group as={Row} className='semester-form-component'>
                                <Col xs={3} />
                                <Col xs={6} className='form-section-content'>
                                    <Form.Label column cs='12' className='season' onClick={() => this.toggleSemesterSection('winter', winterChecked)}>
                                        Winter
                                    <i className='material-icons'>
                                            minimize

                                    </i>

                                    </Form.Label>

                                    <Form.Label column xs='12'>
                                        Do you prefer evening classes?
                                        <Form.Check
                                            type='checkbox'
                                            name='jsonObject.winter.eveningTimePreference'
                                            onChange={this.handleCheckboxChange}
                                            inline
                                        />
                                    </Form.Label>

                                    <div className='number-courses'>
                                        <Form.Label>
                                            How many courses do you prefer to take per semester?
                                        </Form.Label>

                                        <Form.Control column xs={3} model={jsonObject.winter.numberOfCourses} name='jsonObject.winter.numberOfCourses' onChange={this.handleChange} as='select'>
                                            <option value={1}>1</option>
                                            <option value={2}>2</option>
                                            <option value={3}>3</option>
                                            <option value={4}>4</option>
                                            <option value={5}>5</option>
                                        </Form.Control>
                                    </div>

                                </Col>
                                <Col xs={3} />
                            </Form.Group>
                        </div>
                        <div style={{ display: winterChecked ? 'none' : 'initial' }}>
                            <Form.Group as={Row} className='semester-form-component'>
                                <Col xs={3} />
                                <Col xs={6}>
                                    <Form.Label className='season' onClick={() => this.toggleSemesterSection('winter', winterChecked)}>
                                        Winter
                                    <i className='material-icons'>
                                            add
                                    </i>
                                    </Form.Label>
                                </Col>
                            </Form.Group>
                        </div>

                        <div style={{ display: summerChecked ? 'initial' : 'none' }}>
                            <Form.Group as={Row} className='semester-form-component'>
                                <Col xs={3} />
                                <Col xs={6} className='form-section-content'>
                                    <Form.Label column cs='12' className='season' onClick={() => this.toggleSemesterSection('summer', summerChecked)}>
                                        Summer
                                    <i className='material-icons'>
                                            minimize

                                    </i>

                                    </Form.Label>

                                    <Form.Label column xs='12'>
                                        Do you prefer evening classes?
                                        <Form.Check
                                            type='checkbox'
                                            name='jsonObject.summer.eveningTimePreference'
                                            onChange={this.handleCheckboxChange}
                                            inline
                                        />
                                    </Form.Label>

                                    <div className='number-courses'>
                                        <Form.Label>
                                            How many courses do you prefer to take per semester?
                                        </Form.Label>

                                        <Form.Control column xs={3} model={jsonObject.summer.numberOfCourses} name='jsonObject.summer.numberOfCourses' onChange={this.handleChange} as='select'>
                                            <option value={1}>1</option>
                                            <option value={2}>2</option>
                                            <option value={3}>3</option>
                                            <option value={4}>4</option>
                                            <option value={5}>5</option>
                                        </Form.Control>
                                    </div>

                                </Col>
                                <Col xs={3} />
                            </Form.Group>
                        </div>
                        <div style={{ display: summerChecked ? 'none' : 'initial' }}>
                            <Form.Group as={Row} className='semester-form-component'>
                                <Col xs={3} />
                                <Col xs={6}>
                                    <Form.Label className='season' onClick={() => this.toggleSemesterSection('summer', summerChecked)}>
                                        Summer
                                    <i className='material-icons'>
                                            add
                                    </i>
                                    </Form.Label>
                                </Col>
                            </Form.Group>
                        </div>
                    </div>

                    <Button type='submit'>Generate My Schedule!</Button>
                </Form>
            </div>
    );
  }
}

export default StudentForm;
