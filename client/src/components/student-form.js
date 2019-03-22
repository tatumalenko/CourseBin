/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable prefer-destructuring */
import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import {
  Form, Row, Col, Button,
} from 'react-bootstrap';
import Schedule from './schedule';


const _ = require('lodash');

class StudentForm extends Component {
  constructor() {
    super();

    this.catalog = {};
    this.faculty = '';
    this.requestedCourses = {
      fall: [],
      winter: [],
      summer: [],
    };

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

      courseMap: null,
      fall: {
        showListFlag: false,
        selectedFaculty: '',
        selectedCourses: [],
      },
      winter: {
        showListFlag: false,
        selectedFaculty: '',
        selectedCourses: [],
      },
      summer: {
        showListFlag: false,
        selectedFaculty: '',
        selectedCourses: [],
      },

      showSchedule: false,
    };


    this.handleChange = this.handleChange.bind(this);
    this.toggleSemesterSection = this.toggleSemesterSection.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.getCourseCatalog = this.getCourseCatalog.bind(this);
    this.parseCourseCatalog = this.parseCourseCatalog.bind(this);
    this.handleFacultySelection = this.handleFacultySelection.bind(this);
    this.handleCourseSelection = this.handleCourseSelection.bind(this);
    this.handleGenerateSchedule = this.handleGenerateSchedule.bind(this);
  }

  componentDidMount() {
    this.getCourseCatalog();
  }

  getCourseCatalog() {
    axios.get('/catalog').then((response) => {
      if (response.data) {
        console.log('Get Catalog: Catalog found ');
        this.catalog = response.data;
        this.parseCourseCatalog();
      } else {
        console.log('Get Catalog: no data found');
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  parseCourseCatalog() {
    const catalog = this.catalog.catalog;
    const map = {};

    Object.keys(catalog).forEach((course) => {
      const clss = catalog[course];
      let number;
      const regex = /([ ][I][i][i]*[ ])+/g;

      if (clss) {
        const code = clss.code;
        number = parseInt(code.slice(4), 10);

        if (code !== '' && code.length < 8 && number < 500) {
          const faculty = code.slice(0, 4);
          const title = clss.title;
          const displayName = `${number} – ${_.startCase(_.toLower(title))}`;

          if (!map[faculty] && displayName !== '') {
            map[faculty] = [ displayName ];
          } else {
            map[faculty].push(displayName);
          }
        }
      }
    });

    Object.keys(map).forEach((faculty) => {
      if (map[faculty] && map[faculty].length > 0) {
        map[faculty] = _.uniq(map[faculty]).sort();
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
    event.preventDefault();
    if (event && event.target && event.target.value) {
      this.faculty = event.target.value;
      const season = event.target.name;
      switch (season) {
        case 'fall':
          this.setState({
            fall: {
              showListFlag: true,
              selectedFaculty: this.faculty,
              selectedCourses: this.requestedCourses.fall,
            },
          });
          break;
        case 'winter':
          this.setState({
            winter: {
              showListFlag: true,
              selectedFaculty: this.faculty,
              selectedCourses: this.requestedCourses.winter,
            },
          });
          break;
        case 'summer':
          this.setState({
            summer: {
              showListFlag: true,
              selectedFaculty: this.faculty,
              selectedCourses: this.requestedCourses.summer,
            },
          });
          break;
        default:
      }
    }
  }

  handleCourseSelection(event) {
    event.preventDefault();
    if (event && event.target && event.target.value) {
      const courseName = event.target.value;
      const season = (event.target.name);

      switch (season) {
        case 'fall':
          this.requestedCourses.fall.push(`${this.faculty}${courseName.split(' – ')[0]}`);
          this.setState({
            fall: {
              showListFlag: true,
              selectedFaculty: this.faculty,
              selectedCourses: this.requestedCourses.fall,
            },
          });
          break;
        case 'winter':
          this.requestedCourses.winter.push(`${this.faculty}${courseName.split(' – ')[0]}`);
          this.setState({
            winter: {
              showListFlag: true,
              selectedFaculty: this.faculty,
              selectedCourses: this.requestedCourses.winter,
            },
          });
          break;
        case 'summer':
          this.requestedCourses.summer.push(`${this.faculty}${courseName.split(' – ')[0]}`);
          this.setState({
            summer: {
              showListFlag: true,
              selectedFaculty: this.faculty,
              selectedCourses: this.requestedCourses.summer,
            },
          });
          break;
        default:
      }
      console.log(this.requestedCourses);
    }
  }

  handleGenerateSchedule(event) {
    event.preventDefault();
    this.setState({
      showSchedule: true,
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
      showSchedule, fallChecked, summerChecked, winterChecked, jsonObject, courseMap, fall, winter, summer,
    } = this.state;

    return showSchedule
      ? <Schedule />
      : (
        <div className='student-form'>
          <div className='header-logo'><h3 className='title-for-loggedIn'>CourseBin</h3></div>
          <Form onSubmit={this.handleGenerateSchedule}>
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
                      <div className='course-selection-box'>
                        <Form.Label className='add-course-button'>
                          Add a Course
                        <i className='material-icons'>
                            add
                        </i>
                        </Form.Label>
                        <br />
                        <Row>
                          <Form.Label>
                            Department:
                          </Form.Label>
                          <Form.Control
                            as='select'
                            model={fall.selectedFaculty}
                            name='fall'
                            onChange={this.handleFacultySelection}
                          >
                            {courseMap ? Object.keys(courseMap).map(faculty => (
                              <option key={faculty} value={faculty}>
                                {faculty}
                              </option>
                            )) : null}
                          </Form.Control>
                        </Row>
                        <Row>
                          {
                            fall.showListFlag
                              ? (
                                <span>
                                  <Form.Label>
                                    Class:
                                  </Form.Label>
                                  <Form.Control
                                    as='select'
                                    model={fall.selectedCourses}
                                    name='fall'
                                    onChange={this.handleCourseSelection}
                                  >
                                    {courseMap && fall.selectedFaculty && courseMap[fall.selectedFaculty] ? Object.keys(courseMap[fall.selectedFaculty]).map(index => (
                                      <option key={courseMap[fall.selectedFaculty][index]} value={courseMap[fall.selectedFaculty][index]}>
                                        {courseMap[fall.selectedFaculty][index]}
                                      </option>
                                    )) : null
                                    }
                                  </Form.Control>
                                </span>) : null
                          }
                        </Row>
                        <Row className='selected-courses-container'>
                          {fall.selectedCourses ? Object.keys(fall.selectedCourses).map(index => (
                            <div className='selected-courses'>
                              {fall.selectedCourses[index]}
                            </div>
                          )) : null}
                        </Row>
                      </div>
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

                    <div className='course-preferences'>
                      <div className='course-selection-box'>
                        <Form.Label className='add-course-button'>
                          Add a Course
                          <i className='material-icons'>
                            add
                          </i>
                        </Form.Label>
                        <br />
                        <Row>
                          <Form.Label>
                            Department:
                          </Form.Label>
                          <Form.Control
                            as='select'
                            model={winter.selectedFaculty}
                            name='winter'
                            onChange={this.handleFacultySelection}
                          >
                            {courseMap ? Object.keys(courseMap).map(faculty => (
                              <option key={faculty} value={faculty}>
                                {faculty}
                              </option>
                            )) : null}
                          </Form.Control>
                        </Row>
                        <Row>
                          {
                            winter.showListFlag
                              ? (
                                <span>
                                  <Form.Label>
                                    Class:
                                  </Form.Label>
                                  <Form.Control
                                    as='select'
                                    model={winter.selectedCourses}
                                    name='winter'
                                    onChange={this.handleCourseSelection}
                                  >
                                    {courseMap && winter.selectedFaculty && courseMap[winter.selectedFaculty] ? Object.keys(courseMap[winter.selectedFaculty]).map(index => (
                                      <option key={courseMap[winter.selectedFaculty][index]} value={courseMap[winter.selectedFaculty][index]}>
                                        {courseMap[winter.selectedFaculty][index]}
                                      </option>
                                    )) : null
                                    }
                                  </Form.Control>
                                </span>) : null
                          }
                        </Row>
                      </div>
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

                    <div className='course-preferences'>
                      <div className='course-selection-box'>
                        <Form.Label className='add-course-button'>
                          Add a Course
                          <i className='material-icons'>
                            add
                          </i>
                        </Form.Label>
                        <br />
                        <Row>
                          <Form.Label>
                            Department:
                          </Form.Label>
                          <Form.Control
                            as='select'
                            model={summer.selectedFaculty}
                            name='summer'
                            onChange={this.handleFacultySelection}
                          >
                            {courseMap ? Object.keys(courseMap).map(faculty => (
                              <option key={faculty} value={faculty}>
                                {faculty}
                              </option>
                            )) : null}
                          </Form.Control>
                        </Row>
                        <Row>
                          {
                            summer.showListFlag
                              ? (
                                <span>
                                  <Form.Label>
                                    Class:
                                  </Form.Label>
                                  <Form.Control
                                    as='select'
                                    model={summer.selectedCourses}
                                    name='summer'
                                    onChange={this.handleCourseSelection}
                                  >
                                    {courseMap && summer.selectedFaculty && courseMap[summer.selectedFaculty] ? Object.keys(courseMap[summer.selectedFaculty]).map(index => (
                                      <option key={courseMap[summer.selectedFaculty][index]} value={courseMap[summer.selectedFaculty][index]}>
                                        {courseMap[summer.selectedFaculty][index]}
                                      </option>
                                    )) : null
                                    }
                                  </Form.Control>
                                </span>) : null
                          }
                        </Row>
                      </div>
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
