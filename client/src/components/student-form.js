/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable prefer-destructuring */
import React, { Component } from 'react';
import axios from 'axios';

import {
  Form, Row, Col, Button,
} from 'react-bootstrap';

class StudentForm extends Component {
  constructor() {
    super();

    this.catalog = {};
    this.courseMap = {};

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

    this.handleChange = this.handleChange.bind(this);
    this.toggleSemesterSection = this.toggleSemesterSection.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.getCourseCatalog = this.getCourseCatalog.bind(this);
    this.parseCourseCatalog = this.parseCourseCatalog.bind(this);
    this.onDropdownSelected = this.onDropdownSelected.bind(this);
  }

  componentDidMount() {
    this.getCourseCatalog();
  }

  onDropdownSelected =(e) => {
    if (e.target.value !== '') {
      this.setState({
        jsonObject: {
          fall: {
            requestedCourses: [ e.target.value ],
          },
        },
      });
    }
  }

  getCourseCatalog() {
    axios.get('/catalog').then((response) =>  {
      console.log('Get catalog response: ');
      console.log(response.data);
      if (response.data) {
        console.log('Get Catalog: Catalog found ');
        this.catalog = response.data;
        this.parseCourseCatalog();
      } else {
        console.log('Get Catalog: no data found');
      }
    }).catch((error) => {
      console.log('Get Catalog: no catalog found');
      console.error(error);
    });
  }

  parseCourseCatalog() {
    const catalog = this.catalog.catalog;
    Object.keys(catalog, (course) => {
      const faculty = catalog[course].code.slice(0, 4);
      if (!this.courseMap[faculty]) {
        this.courseMap[faculty] = [ catalog[course].code.slice(4) ];
      } else {
        this.courseMap[faculty].push(catalog[course].code.slice(4));
      }
    });
    console.log(this.courseMap);
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
      fallChecked, summerChecked, winterChecked, jsonObject, courseMap
    } = this.state;

    return (

                <div className='student-form'>
                     <div className='header-logo'><h3 className='title-for-loggedIn'>CourseBin</h3></div>
                    <Form onSubmit={this.handleSubmit}>
                        <h3 id='form-header'>First, we will just need some basic information... </h3>
                        <div id='student-form-content'>
                            <div style={{ display: fallChecked ? 'initial' : 'none' }}>
                                <Form.Group as={Row} className='semester-form-component'>
                                    <Col xs={3} />
                                    <Col xs={6} className='form-section-content'>
                                        <Form.Label column xs='12' className='season' onClick={() => this.toggleSemesterSection('fall', fallChecked)}>
                                            Fall
                                    <i className='material-icons'>
                                                minimize
                                    </i>

                                        </Form.Label>

                                        <Form.Label column xs={12}>
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

                                        <div className='course-preferences'>
                                          <Form.Label>
                                              Any course in particular you are interested in taking?
                                          </Form.Label>

                                          {/*
                                            <Form.Control column xs={3} model={jsonObject.fall.requestedCourses} name='jsonObject.fall.requestecCourses' onChange={this.onDropdownSelected} as='select'>
                                            { this.state.jsonObject.fall.requestedCourses.map((faculty, number) =>
                                              <option key={index} value={index}>
                                                  {option.name}
                                              </option>)
                                            }
                                            </Form.Control>
                                          */}
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
                                        <Form.Label column xs='12' className='season' onClick={() => this.toggleSemesterSection('winter', winterChecked)}>
                                            Winter
                                    <i className='material-icons'>
                                                minimize
    
                                    </i>

                                        </Form.Label>

                                        <Form.Label column xs={12}>
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
                                      <Form.Label
                                      column xs={12}
                                      className='season'
                                      onClick={() => this.toggleSemesterSection('summer', summerChecked)}
                                      >
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
                                        <Form.Control
                                        column xs={3}
                                        model={jsonObject.summer.numberOfCourses}
                                        name='jsonObject.summer.numberOfCourses'
                                        onChange={this.handleChange}
                                        as='select'
                                        >
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
                                        <Form.Label
                                        className='season'
                                        onClick={
                                          () => this.toggleSemesterSection('summer', summerChecked)
                                        }
                                        >
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
