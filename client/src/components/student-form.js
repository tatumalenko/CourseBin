/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable prefer-destructuring */
import React, { Component } from 'react';
import axios from 'axios';
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
    this.MAX_NUM_COURSES = 6;

    this.state = {
      courseMap: null,

      fallExpanded: false,
      fallTimePreference: false,
      fallNumOfCourses: 4,
      fallSelectedFaculty: null,
      fallSelectedCourses: [],
      fallErrMsg: null,

      winterExpanded: false,
      winterTimePreference: false,
      winterNumOfCourses: 4,
      winterSelectedFaculty: null,
      winterSelectedCourses: [],
      winterErrMsg: null,

      summerExpanded: false,
      summerTimePreference: false,
      summerNumOfCourses: 4,
      summerSelectedFaculty: null,
      summerSelectedCourses: [],
      summerErrMsg: null,

      showSchedule: false,
    };


    this.handleChange = this.handleChange.bind(this);
    this.toggleSemesterSection = this.toggleSemesterSection.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.getCourseCatalog = this.getCourseCatalog.bind(this);
    this.parseCourseCatalog = this.parseCourseCatalog.bind(this);
    this.handleCourseSelection = this.handleCourseSelection.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setErrMsg = this.setErrMsg.bind(this);
  }

  componentDidMount() {
    this.getCourseCatalog();
  }

  setErrMsg(season, msg) {
    switch (season) {
      case 'fallSelectedCourses': this.setState({ fallErrMsg: msg });
        break;
      case 'winterSelectedCourses': this.setState({ winterErrMsg: msg });
        break;
      case 'summerSelectedCourses': this.setState({ summerErrMsg: msg });
        break;
      default:
    }
  }


  getCourseCatalog() {
    axios.get('/catalog').then((response) => {
      if (response.data) {
        console.log(response.data);
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

      if (clss) {
        const code = clss.code;
        number = parseInt(code.slice(4), 10);
        let departmentName = '';

        if (code !== '' && code.length < 8 && number < 500) {
          const faculty = code.slice(0, 4);
          switch (faculty) {
            case 'SOEN': departmentName = 'Software Engineering';
              break;
            case 'COMP': departmentName = 'Computer Science';
              break;
            case 'ENCS': departmentName = 'Engineering & Computer Science';
              break;
            case 'ENGR': departmentName = 'Engineering';
              break;
            case 'CIVI': departmentName = 'Civil Engineering';
              break;
            case 'COEN': departmentName = 'Computer Engineering';
              break;
            case 'MECH': departmentName = 'Mechanical Engineering';
              break;
            case 'ELEC': departmentName = 'Electrical Engineering';
              break;
            case 'CHEM': departmentName = 'Chemistry';
              break;
            case 'PHYS': departmentName = 'Physics';
              break;
            case 'BIOL': departmentName = 'Biology';
              break;
            case 'MATH': departmentName = 'Mathematics';
              break;
            default: departmentName = faculty;
          }
          const title = clss.title;
          let displayName;
          if (_.includes(title.toUpperCase(), 'II') || _.includes(title.toUpperCase(), 'III')) {
            displayName = `${code} – ${title}`;
          } else {
            displayName = `${code} – ${_.startCase(_.toLower(title))}`;
          }

          if (!map[departmentName] && displayName !== '') {
            map[departmentName] = [ displayName ];
          } else {
            map[departmentName].push(displayName);
          }
        }
      }
    });

    Object.keys(map).forEach((departmentName) => {
      if (map[departmentName] && map[departmentName].length > 0) {
        map[departmentName] = _.uniq(map[departmentName]).sort();
      }
    });

    this.setState({
      courseMap: map,
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


  handleChange(event) {
    event.preventDefault();
    const target = event.target;
    this.setState({
      [target.name]: target.value,
    });
    console.log(`${target.name}  ${target.value}`);
  }

  handleFacultySelection(event) {
    event.preventDefault();
    const target = event.target;
    const property = target.name;
    const departmentName = target.value;

    this.setState({
      [property]: departmentName,
    });
  }

  handleCourseSelection(event) {
    event.preventDefault();
    if (event && event.target && event.target.value) {
      const state = this.state;
      const target = event.target;
      const property = target.name;
      const course = target.value;
      const courseCode = course.split(' – ')[0];

      if (!state[property]) {
        this.setState({
          [property]: [ courseCode ],
        });
        this.setErrMsg(property, null);
      } else if (state[property].length >= this.MAX_NUM_COURSES) {
        this.setErrMsg(property, 'You have added the maximum number of courses per semester');
      } else if (_.includes(state[property], courseCode)) {
        this.setErrMsg(property, `You have already added the course ${courseCode}`);
      } else if (state[property]) {
        const newState = Object.assign({}, state);
        newState[property].push(courseCode);
        this.setState(newState);
        this.setErrMsg(property, null);
      }
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const state = this.state;

    const jsonObject = {
      fall: {
        requestedCourses: state.fallSelectedCourses,
        eveningTimePreference: state.fallTimePreference,
        numberOfCourses: state.fallNumOfCourses,
      },

      winter: {
        requestedCourses: state.winterSelectedCourses,
        eveningTimePreference: state.winterTimePreference,
        numberOfCourses: state.winterNumOfCourses,
      },

      summer: {
        requestedCourses: state.summerSelectedCourses,
        eveningTimePreference: state.summerTimePreference,
        numberOfCourses: state.summerNumOfCourses,
      },
    };

    axios.post('/user/schedule', jsonObject)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });

    // go to schedule page
    this.setState({
      showSchedule: true,
    });
  }


  toggleSemesterSection(season, toggle) {
    this.setState({
      [season]: !toggle,
    });
  }


  render() {
    const {
      courseMap,

      fallExpanded,
      fallNumOfCourses,
      fallSelectedFaculty,
      fallSelectedCourses,
      fallErrMsg,

      winterExpanded,
      winterNumOfCourses,
      winterSelectedFaculty,
      winterSelectedCourses,
      winterErrMsg,

      summerExpanded,
      summerNumOfCourses,
      summerSelectedFaculty,
      summerSelectedCourses,
      summerErrMsg,

      showSchedule,
    } = this.state;

    return showSchedule
      ? <Schedule />
      : (
        <div className='student-form'>
          <div className='header-logo'><h3 className='title-for-loggedIn'>CourseBin</h3></div>
          <Form onSubmit={this.handleSubmit}>
            <h3 id='form-header'>First, we will just need some basic information... </h3>
            <div id='student-form-content'>
              <div style={{ display: fallExpanded ? 'initial' : 'none' }}>
                <Form.Group as={Row} className='semester-form-component'>
                  <Col xs={3} />
                  <Col xs={6} className='form-section-content'>
                    <Form.Label
                      className='season'
                      onClick={
                        () => this.toggleSemesterSection('fallExpanded', fallExpanded)
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
                        name='fallTimePreference'
                        onChange={this.handleCheckboxChange}
                        inline
                      />
                    </Form.Label>

                    <div className='number-courses'>
                      <Form.Label>
                        How many courses do you prefer to take per semester?
                      </Form.Label>

                      <Form.Control
                        model={fallNumOfCourses}
                        name='fallNumOfCourses'
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
                          Any courses you want to take in particular?
                        </Form.Label>
                        <br />
                        <Row>
                          <Form.Label>
                            Select a department:
                          </Form.Label>
                          <Form.Control
                            as='select'
                            model={fallSelectedFaculty}
                            name='fallSelectedFaculty'
                            onChange={this.handleChange}
                            multiple
                          >
                            {courseMap ? Object.keys(courseMap).map(faculty => (
                              <option key={faculty} value={faculty}>
                                {faculty}
                              </option>
                            )) : null}
                          </Form.Control>
                        </Row>
                        <Row>
                          <div style={{ display: !fallSelectedFaculty ? 'none' : 'initial' }}>
                            <Form.Label>
                              Select a class:
                            </Form.Label>
                            <Form.Control
                              as='select'
                              model={fallSelectedCourses}
                              name='fallSelectedCourses'
                              onChange={this.handleCourseSelection}
                              multiple
                            >
                              {courseMap && fallSelectedFaculty && courseMap[fallSelectedFaculty] ? Object.keys(courseMap[fallSelectedFaculty]).map(index => (
                                <option key={courseMap[fallSelectedFaculty][index]} value={courseMap[fallSelectedFaculty][index]}>
                                  {courseMap[fallSelectedFaculty][index]}
                                </option>
                              )) : null
                              }
                            </Form.Control>
                          </div>
                        </Row>
                        <Row className='selected-courses-container'>
                          <div className='course-err-msg'>{fallErrMsg}</div>
                          <Form.Label className='selected-courses-label' style={{ display: fallSelectedCourses.length === 0 ? 'none' : 'initial' }}>Selected Courses:</Form.Label>
                          {fallSelectedCourses ? Object.keys(fallSelectedCourses).map(index => (
                            <div className='selected-courses'>
                              {fallSelectedCourses[index]}
                            </div>
                          )) : <div />}
                        </Row>
                      </div>
                    </div>
                  </Col>
                  <Col xs={3} />
                </Form.Group>
              </div>
              <div style={{ display: fallExpanded ? 'none' : 'initial' }}>
                <Form.Group as={Row} className='semester-form-component'>
                  <Col xs={3} />
                  <Col xs={6}>
                    <Form.Label className='season' onClick={() => this.toggleSemesterSection('fallExpanded', fallExpanded)}>
                      Fall
                        <i className='material-icons'>
                        add
                        </i>
                    </Form.Label>
                  </Col>
                </Form.Group>
              </div>


              <div style={{ display: winterExpanded ? 'initial' : 'none' }}>
                <Form.Group as={Row} className='semester-form-component'>
                  <Col xs={3} />
                  <Col xs={6} className='form-section-content'>
                    <Form.Label className='season' onClick={() => this.toggleSemesterSection('winterExpanded', winterExpanded)}>
                      Winter
                        <i className='material-icons'>
                        minimize

                        </i>

                    </Form.Label>

                    <Form.Label className='evening-checkbox'>
                      Do you prefer evening classes?
                            <Form.Check
                        type='checkbox'
                        name='winterTimePreference'
                        onChange={this.handleCheckboxChange}
                        inline
                            />
                    </Form.Label>

                    <div className='number-courses'>
                      <Form.Label>
                        How many courses do you prefer to take per semester?
                      </Form.Label>
                      <Form.Control model={winterNumOfCourses} name='winterNumOfCourses' onChange={this.handleChange} as='select'>
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
                          Any courses you want to take in particular?
                        </Form.Label>
                        <br />
                        <Row>
                          <Form.Label>
                            Select a department:
                          </Form.Label>
                          <Form.Control
                            as='select'
                            model={winterSelectedFaculty}
                            name='winterSelectedFaculty'
                            onChange={this.handleChange}
                            multiple
                          >
                            {courseMap ? Object.keys(courseMap).map(faculty => (
                              <option key={faculty} value={faculty}>
                                {faculty}
                              </option>
                            )) : null}
                          </Form.Control>
                        </Row>
                        <Row>
                          <div style={{ display: !winterSelectedFaculty ? 'none' : 'initial' }}>
                            <Form.Label>
                              Select a class:
                            </Form.Label>
                            <Form.Control
                              as='select'
                              model={winterSelectedCourses}
                              name='winterSelectedCourses'
                              onChange={this.handleCourseSelection}
                              multiple
                            >
                              {courseMap && winterSelectedFaculty && courseMap[winterSelectedFaculty] ? Object.keys(courseMap[winterSelectedFaculty]).map(index => (
                                <option key={courseMap[winterSelectedFaculty][index]} value={courseMap[winterSelectedFaculty][index]}>
                                  {courseMap[winterSelectedFaculty][index]}
                                </option>
                              )) : null
                              }
                            </Form.Control>
                          </div>
                        </Row>
                        <Row className='selected-courses-container'>
                          <div className='course-err-msg'>{winterErrMsg}</div>
                          <Form.Label className='selected-courses-label' style={{ display: winterSelectedCourses.length === 0 ? 'none' : 'initial' }}>Selected Courses:</Form.Label>
                          {winterSelectedCourses ? Object.keys(winterSelectedCourses).map(index => (
                            <div className='selected-courses'>
                              {winterSelectedCourses[index]}
                            </div>
                          )) : <div />}
                        </Row>
                      </div>
                    </div>

                  </Col>
                  <Col xs={3} />
                </Form.Group>
              </div>
              <div style={{ display: winterExpanded ? 'none' : 'initial' }}>
                <Form.Group as={Row} className='semester-form-component'>
                  <Col xs={3} />
                  <Col xs={6}>
                    <Form.Label className='season' onClick={() => this.toggleSemesterSection('winterExpanded', winterExpanded)}>
                      Winter
                        <i className='material-icons'>
                        add
                        </i>
                    </Form.Label>
                  </Col>
                </Form.Group>
              </div>

              <div style={{ display: summerExpanded ? 'initial' : 'none' }}>
                <Form.Group as={Row} className='semester-form-component'>
                  <Col xs={3} />
                  <Col xs={6} className='form-section-content'>
                    <Form.Label
                      className='season'
                      onClick={() => this.toggleSemesterSection('summerExpanded', summerExpanded)}
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
                        name='summerTimePreference'
                        onChange={this.handleCheckboxChange}
                        inline
                        />
                    </Form.Label>

                    <div className='number-courses'>
                      <Form.Label>
                        How many courses do you prefer to take per semester?
                      </Form.Label>
                      <Form.Control
                        model={summerNumOfCourses}
                        name='summerNumOfCourses'
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
                          Any courses you want to take in particular?
                        </Form.Label>
                        <br />
                        <Row>
                          <Form.Label>
                            Select a department:
                          </Form.Label>
                          <Form.Control
                            as='select'
                            model={summerSelectedFaculty}
                            name='summerSelectedFaculty'
                            onChange={this.handleChange}
                            multiple
                          >
                            {courseMap ? Object.keys(courseMap).map(faculty => (
                              <option key={faculty} value={faculty}>
                                {faculty}
                              </option>
                            )) : null}
                          </Form.Control>
                        </Row>
                        <Row>
                          <div style={{ display: !summerSelectedFaculty ? 'none' : 'initial' }}>
                            <Form.Label>
                              Select a class:
                            </Form.Label>
                            <Form.Control
                              as='select'
                              model={summerSelectedCourses}
                              name='summerSelectedCourses'
                              onChange={this.handleCourseSelection}
                              multiple
                            >
                              {courseMap && summerSelectedFaculty && courseMap[summerSelectedFaculty] ? Object.keys(courseMap[summerSelectedFaculty]).map(index => (
                                <option key={courseMap[summerSelectedFaculty][index]} value={courseMap[summerSelectedFaculty][index]}>
                                  {courseMap[summerSelectedFaculty][index]}
                                </option>
                              )) : null
                              }
                            </Form.Control>
                          </div>
                        </Row>
                        <Row className='selected-courses-container'>
                          <div className='course-err-msg'>{summerErrMsg}</div>
                          <Form.Label className='selected-courses-label' style={{ display: summerSelectedCourses === 0 ? 'none' : 'initial' }}>CSelected Courses:</Form.Label>
                          {summerSelectedCourses ? Object.keys(summerSelectedCourses).map(index => (
                            <div className='selected-courses'>
                              {summerSelectedCourses[index]}
                            </div>
                          )) : <div />}
                        </Row>
                      </div>
                    </div>

                  </Col>
                  <Col xs={3} />
                </Form.Group>
              </div>
              <div style={{ display: summerExpanded ? 'none' : 'initial' }}>
                <Form.Group as={Row} className='semester-form-component'>
                  <Col xs={3} />
                  <Col xs={6}>
                    <Form.Label
                      className='season'
                      onClick={
                        () => this.toggleSemesterSection('summerExpanded', summerExpanded)
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
