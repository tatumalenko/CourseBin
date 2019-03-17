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
      showListFlag: false,
      fallChecked: false,
      winterChecked: false,
      summerChecked: false,
      courseMap: null,
      fall: {
        selectedFaculty: '',
        selectedCourses: {},
      },
      winter: {
        selectedFaculty: '',
        selectedCourses: {},
      },
      summer: {
        selectedFaculty: '',
        selectedCourses: {},
      },


    };


    this.handleChange = this.handleChange.bind(this);
    this.toggleSemesterSection = this.toggleSemesterSection.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.getCourseCatalog = this.getCourseCatalog.bind(this);
    this.parseCourseCatalog = this.parseCourseCatalog.bind(this);
    this.onDropdownSelected = this.onDropdownSelected.bind(this);
    this.handleFacultySelection = this.handleFacultySelection.bind(this);
    this.handleCourseSelection = this.handleCourseSelection.bind(this);
  }

  componentDidMount() {
    this.getCourseCatalog();
  }

  onDropdownSelected = (e) => {
    console.log(e);
    console.log(this.jsonObject.fall.requestedCourses);
  }

  getCourseCatalog() {
    axios.get('/catalog').then((response) => {
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
    const map = {};

    this.setState({
      courseMap: {},
    });

    Object.keys(catalog).forEach((course) => {
      const clss = catalog[course];

      if (clss) {
        const code = clss.code;
        const number = parseInt(code.slice(4), 10);

        if (code !== '' && code.length < 8 && number < 500) {
          const faculty = code.slice(0, 4);
          const title = clss.title;

          if (!map[faculty] && title !== '') {
            map[faculty] = [ title ];
          } else {
            map[faculty].push(title);
          }
        }
      }
    });

    Object.keys(map).forEach((faculty) => {
      if (map[faculty] && map[faculty].length > 0) {
        map[faculty].sort();
      }
    });

    this.setState({
      courseMap: map,
    });
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

  handleFacultySelection(event) {
    if (event && event.target && event.target.value) {
      console.log(event.target.value);
      this.setState({
        showListFlag: true,
      });
      console.log(this.state);
    }
  }

  handleCourseSelection(event) {
    if (event && event.target && event.target.value) {
      console.log(event.target.value);
      this.setState({
        fall: {
          selectedCourses: event.target.value,
        },
      });
    }
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
      fallChecked, summerChecked, winterChecked, jsonObject, courseMap, showListFlag, fall,
    } = this.state;

    return (
      <div className='student-form'>
        <h3 className='header-logo'>Coursebin</h3>
        <Form onSubmit={this.handleSubmit}>
          <h3 id='form-header'>First, we will just need some basic information... </h3>
          <div id='student-form-content'>
            <div style={{ display: fallChecked ? 'initial' : 'none' }}>
              <Form.Group as={Row} className='semester-form-component'>
                <Col xs={3} />
                <Col xs={6} className='form-section-content'>
                  <Form.Label
                    className='season'
                    onClick={
                      () => this.toggleSemesterSection('fall', fallChecked)
                    }
                  >
                    Fall
                        <i className='material-icons'>
                      minimize
                        </i>

                  </Form.Label>

                  <Form.Label className='evening-checkbox'>
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

                    <Form.Control
                      model={jsonObject.fall.numberOfCourses}
                      name='jsonObject.fall.numberOfCourses'
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

                  <div className='course-preferences'>
                    <Form.Label>
                      Add a Course
                      <i className='material-icons'>
                        add
                      </i>
                    </Form.Label>

                    <Form.Control
                      as='select'
                      model={fall.selectedFaculty}
                      name='fall.selectedFaculty'
                      onChange={this.handleFacultySelection}
                    >
                      {courseMap ? Object.keys(courseMap).map(faculty => (
                        <option key={faculty} value={faculty}>
                          {faculty}
                        </option>
                      )) : null}
                    </Form.Control>

                    {showListFlag
                      ? (
                        <Form.Control
                          as='select'
                          model={fall.selectedCourses}
                          name='fall.selectedCourses'
                          onChange={this.handleCourseSelection}
                        >
                          {courseMap && fall.selectedFaculty && courseMap[fall.selectedFaculty]
                            ? Object.keys(courseMap[fall.selectedFaculty]).map(index => (
                              <option key={courseMap[fall.selectedFaculty][index]} value={courseMap[fall.selectedFaculty][index]}>
                                {courseMap[fall.selectedFaculty][index]}
                              </option>
                            ))
                            : null}
                        </Form.Control>
                      )
                      : null
                    }


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
                  <Form.Label className='season' onClick={() => this.toggleSemesterSection('winter', winterChecked)}>
                    Winter
                        <i className='material-icons'>
                      minimize

                        </i>

                  </Form.Label>

                  <Form.Label className='evening-checkbox'>
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

                    <Form.Control model={jsonObject.winter.numberOfCourses} name='jsonObject.winter.numberOfCourses' onChange={this.handleChange} as='select'>
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
                    className='season'
                    onClick={() => this.toggleSemesterSection('summer', summerChecked)}
                  >
                    Summer
                          <i className='material-icons'>
                      minimize

                          </i>

                  </Form.Label>

                  <Form.Label className='evening-checkbox'>
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
