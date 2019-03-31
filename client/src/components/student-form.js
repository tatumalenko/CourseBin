/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable prefer-destructuring */
import React, { Component } from 'react';
import axios from 'axios';
// import {
//   Form, Row, Col, Button, ToggleButtonGroup, ToggleButton,
// } from 'react-bootstrap';
import { green } from '@material-ui/core/colors';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { withStyles } from '@material-ui/core/styles';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import {
  AppBar,
  Button,
  FormLabel,
  FormControl,
  Grid,
  Checkbox,
  ListItemText,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Typography,
} from '@material-ui/core';

import Plan from './plan';


const _ = require('lodash');

function TabContainer(props) {
  const { children, dir } = props;

  return (
    <Typography component='div' dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

const styles = theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  fabGreen: {
    'color': theme.palette.common.white,
    'backgroundColor': green[500],
    '&:hover': {
      backgroundColor: green[600],
    },
  },
  toggleContainer: {
    height: 56,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: `${theme.spacing.unit}px 0`,
    background: theme.palette.background.pr,
  },
});

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

class StudentForm extends Component {
  constructor(props) {
    super(props);

    this.catalog = {};
    this.faculty = '';
    this.MAX_NUM_COURSES = 6;

    this.state = {
      courseMap: null,

      currentView: 0,
      openFaculty: false,

      fallTimePreference: false,
      fallNumOfCourses: 4,
      fallSelectedFaculty: null,
      fallSelectedCourses: [],
      fallErrMsg: null,

      winterTimePreference: false,
      winterNumOfCourses: 4,
      winterSelectedFaculty: null,
      winterSelectedCourses: [],
      winterErrMsg: null,

      summerTimePreference: false,
      summerNumOfCourses: 4,
      summerSelectedFaculty: null,
      summerSelectedCourses: [],
      summerErrMsg: null,

      showPlan: false,
    };


    this.handleFacultyChange = this.handleFacultyChange.bind(this);
    this.handleViewChange = this.handleViewChange.bind(this);
    this.handleOpenFaculty = this.handleOpenFaculty.bind(this);
    this.handleCloseFaculty = this.handleCloseFaculty.bind(this);
    this.handleChangeIndex = this.handleChangeIndex.bind(this);
    this.handleFallNumCourseChange = this.handleFallNumCourseChange.bind(this);
    this.handleWinterNumCourseChange = this.handleWinterNumCourseChange.bind(this);
    this.handleSummerNumCourseChange = this.handleSummerNumCourseChange.bind(this);
    this.handleFallTimeChange = this.handleFallTimeChange.bind(this);
    this.handleWinterTimeChange = this.handleWinterTimeChange.bind(this);
    this.handleSummerTimeChange = this.handleSummerTimeChange.bind(this);
    this.getCourseCatalog = this.getCourseCatalog.bind(this);
    this.parseCourseCatalog = this.parseCourseCatalog.bind(this);
    this.handleCourseSelection = this.handleCourseSelection.bind(this);
    this.removeCourseSelection = this.removeCourseSelection.bind(this);
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

  handleViewChange = (event, value) => {
    event.preventDefault();
    const view = _.parseInt(value);
    this.setState({ currentView: view });
  };

  handleChangeIndex = (index) => {
    this.setState({ value: index });
  };


  handleFallTimeChange = (event, fallTimePreference) => {
    this.setState({ fallTimePreference });
  }

  handleWinterTimeChange = (event, winterTimePreference) => {
    this.setState({ winterTimePreference });
  }

  handleSummerTimeChange = (event, summerTimePreference) => {
    this.setState({ summerTimePreference });
  }

  handleFallNumCourseChange = (event, fallNumOfCourses) => {
    this.setState({ fallNumOfCourses });
    console.log(this.state);
  }

  handleWinterNumCourseChange = (event, winterNumOfCourses) => {
    this.setState({ winterNumOfCourses });
  }

  handleSummerNumCourseChange = (event, summerNumOfCourses) => {
    this.setState({ summerNumOfCourses });
  }

  handleCloseFaculty = () => {
    this.setState({ openFaculty: false });
  };

  handleOpenFaculty = () => {
    this.setState({ openFaculty: true });
  };


  handleCourseSelection = (event) => {
    event.preventDefault();
    const state = this.state;
    const target = event.target;
    const property = target.name;

    for (let i = 0, l = target.length; i < l; i += 1) {
      console.log(property);
      const courseCode = target[i].value;

      let numCourses;
      switch (property) {
        case 'fallSelectedCourses': numCourses = 'fallNumOfCourses';
          break;
        case 'winterSelectedCourses': numCourses = 'winterNumOfCourses';
          break;
        case 'summerSelectedCourses': numCourses = 'summerNumOfCourses';
          break;
        default:
      }

      if (!state[property]) {
        this.setState({
          [property]: [ courseCode ],
        });
        this.setErrMsg(property, null);
      } else if (state[property].length === state[numCourses]) {
        this.setErrMsg(property, 'Cannot add more courses than you have requested per semester');
      } else if (state[property].length === this.MAX_NUM_COURSES) {
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
    console.log(this.state);
  }

  handleFacultyChange(event) {
    event.preventDefault();
    const target = event.target;
    this.setState({
      [target.name]: target.value,
    });

    console.log(this.state);
  }

  handleSubmit(event) {
    event.preventDefault();
    const state = this.state;
    console.log(state);

    const jsonObject = {
      fall: {
        requestedCourses: state.fallSelectedCourses.map(e => e.slice(0, 7)),
        eveningTimePreference: state.fallTimePreference,
        numberOfCourses: state.fallNumOfCourses,
      },

      winter: {
        requestedCourses: state.winterSelectedCourses.map(e => e.slice(0, 7)),
        eveningTimePreference: state.winterTimePreference,
        numberOfCourses: state.winterNumOfCourses,
      },

      summer: {
        requestedCourses: state.summerSelectedCourses.map(e => e.slice(0, 7)),
        eveningTimePreference: state.summerTimePreference,
        numberOfCourses: state.summerNumOfCourses,
      },
    };

    axios.post('/user/plan', jsonObject)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });

    // go to schedule page
    this.setState({
      showPlan: true,
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

    const defaultFaculty = 'Software Engineering';

    this.setState({
      courseMap: map,
      fallSelectedFaculty: defaultFaculty,
      winterSelectedFaculty: defaultFaculty,
      summerSelectedFaculty: defaultFaculty,
    });
  }

  removeCourseSelection(property, index) {
    const state = this.state;
    const newState = Object.assign({}, state);
    newState[property].splice(index, 1);
    this.setState(newState);
  }

  render() {
    const { classes, theme } = this.props;

    const {
      courseMap,

      currentView,

      openFaculty,

      fallTimePreference,
      fallNumOfCourses,
      fallSelectedFaculty,
      fallSelectedCourses,
      fallErrMsg,

      winterSelectedFaculty,
      winterSelectedCourses,
      winterErrMsg,

      summerSelectedFaculty,
      summerSelectedCourses,
      summerErrMsg,

      showPlan,
    } = this.state;

    return showPlan
      ? <Plan />
      : (
        <div className={classes.root}>
          <div className='header-logo'>
            <h3>CourseBin</h3>
          </div>
          <div className='student-form'>
            <form onSubmit={this.handleSubmit}>
              <h3 id='form-header'>First, we will just need some basic information... </h3>
              <div id='student-form-content'>
                <AppBar position='static' color='secondary'>
                  <Tabs
                    value={currentView}
                    onChange={this.handleViewChange}
                    indicatorColor='secondary'
                    textColor='secondary'
                    variant='fullWidth'
                  >
                    <Tab label='Fall ' />
                    <Tab label='Winter ' />
                    <Tab label='Summer ' />
                  </Tabs>
                </AppBar>
                <SwipeableViews
                  axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                  index={currentView}
                  onChangeIndex={this.handleChangeIndex}
                >
                  <TabContainer dir={theme.direction}>

                    <Grid container spacing={16} className='semester-form-component'>
                      <Grid item xs={12} className='evening-checkbox'>
                        <FormControl>
                          <FormLabel>
                            What is your time preference?
                          </FormLabel>
                          <div className={classes.toggleContainer}>
                            <ToggleButtonGroup
                              defaultValue
                              value={fallTimePreference}
                              exclusive
                              onChange={this.handleFallTimeChange}
                            >
                              <ToggleButton value={false} variant='outline-info'>Day</ToggleButton>
                              <ToggleButton value={true} variant='outline-info'>Evening</ToggleButton>
                            </ToggleButtonGroup>
                          </div>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} className='number-courses'>
                        <FormLabel>
                          How many courses do you prefer to take per semester?
                        </FormLabel>
                        <div className={classes.toggleContainer}>
                          <ToggleButtonGroup
                            defaultValue
                            value={fallNumOfCourses}
                            exclusive
                            onChange={this.handleFallNumCourseChange}
                          >
                            <ToggleButton value={1} variant='outline-info'>1</ToggleButton>
                            <ToggleButton value={2} variant='outline-info'>2</ToggleButton>
                            <ToggleButton value={3} variant='outline-info'>3</ToggleButton>
                            <ToggleButton value={4} variant='outline-info'>4</ToggleButton>
                            <ToggleButton value={5} variant='outline-info'>5</ToggleButton>
                            <ToggleButton value={6} variant='outline-info'>6</ToggleButton>
                          </ToggleButtonGroup>
                        </div>
                      </Grid>
                      {courseMap && fallSelectedFaculty ? (
                        <Grid container spacing={16} className='course-selection-box'>
                          <Grid item xs={12}>
                            <FormControl>
                              <Select
                                open={openFaculty}
                                onClose={this.handleCloseFaculty}
                                onOpen={this.handleOpenFaculty}
                                value={fallSelectedFaculty}
                                onChange={this.handleFacultyChange}
                                inputProps={{
                                  name: 'fallSelectedFaculty',
                                  id: 'demo-controlled-open-select',
                                }}
                              >
                                {courseMap ? Object.keys(courseMap).map(faculty => (
                                  <MenuItem key={faculty} value={faculty}>
                                    {faculty}
                                  </MenuItem>
                                )) : null}
                              </Select>
                            </FormControl>
                          </Grid>

                          <FormLabel className='course-selection-label'>
                            Select a class:
                          </FormLabel>
                          <FormControl>
                            <Select
                              multiple
                              native
                              value={fallSelectedCourses}
                              onChange={this.handleCourseSelection}
                              name='fallSelectedCourses'
                              inputProps={{
                                name: 'fallSelectedCourses',
                                id: 'demo-controlled-open-select',
                              }}
                            >
                              {courseMap && fallSelectedFaculty && courseMap[fallSelectedFaculty] ? courseMap[fallSelectedFaculty].map(course => (
                                <option key={course} value={course}>
                                  {course}
                                </option>
                              )) : null
                              }
                            </Select>
                          </FormControl>
                        </Grid>
                      )
                        : null
                      }


                      <Grid item xs={12} className='selected-courses-container'>
                        <div className='course-err-msg'>{fallErrMsg}</div>
                        <FormLabel className='selected-courses-label' style={{ display: fallSelectedCourses.length === 0 ? 'none' : 'initial' }}>Selected Courses:</FormLabel>
                        {fallSelectedCourses ? Object.keys(fallSelectedCourses).map(index => (
                          <div className='selected-courses'>
                            <FormLabel
                              className='rm-course'
                              title='remove course?'
                              onClick={() => this.removeCourseSelection('fallSelectedCourses', index)}
                            >
                              <i className='material-icons'>
                                delete_forever
                              </i>
                            </FormLabel>
                            {fallSelectedCourses[index]}
                          </div>
                        )) : <div />}
                      </Grid>

                    </Grid>
                  </TabContainer>
                  <TabContainer dir={theme.direction}>Item Two</TabContainer>
                  <TabContainer dir={theme.direction}>Item Three</TabContainer>
                </SwipeableViews>


                {/* <Form.Group as={Row} className='semester-form-component'>
                  <Col xs={3} />
                  <Col xs={6} className='form-section-content'>

                    <div className='evening-checkbox'>
                      <Form.Label>
                        Time preference?
                      </Form.Label>

                      <ToggleButtonGroup
                        type='radio'
                        defaultValue={false}
                        name='winterTimePreference'
                        onChange={this.handleCheckboxChange}
                      >
                        <ToggleButton variant='outline-info' value={false}>Day</ToggleButton>
                        <ToggleButton variant='outline-info' value>Evening</ToggleButton>

                      </ToggleButtonGroup>
                    </div>

                    <div className='number-courses'>
                      <Form.Label>
                        How many courses do you prefer to take per semester?
                      </Form.Label>
                      <ToggleButtonGroup
                        className='num-courses-button'
                        type='radio'
                        defaultValue={4}
                        name='winter'
                        onChange={this.handleNumCourseChange}
                      >
                        <ToggleButton variant='outline-info' value={1}>1</ToggleButton>
                        <ToggleButton variant='outline-info' value={2}>2</ToggleButton>
                        <ToggleButton variant='outline-info' value={3}>3</ToggleButton>
                        <ToggleButton variant='outline-info' value={4}>4 </ToggleButton>
                        <ToggleButton variant='outline-info' value={5}>5</ToggleButton>
                        <ToggleButton variant='outline-info' value={6}>6</ToggleButton>
                      </ToggleButtonGroup>
                    </div>

                    <div className='course-preferences' style={{ display: courseMap ? 'initial' : 'none' }}>
                      <div className='course-selection-box'>
                        <Form.Label className='add-course-button'>
                          Any courses you want to take in particular?
                        </Form.Label>
                        <br />
                        <Row>
                          <Form.Label className='course-selection-label'>
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
                            <Form.Label className='course-selection-label'>
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
                              <Form.Label
                                className='rm-course'
                                title='reomve course?'
                                onClick={() => this.removeCourseSelection('winterSelectedCourses', index)}
                              >
                                <i className='material-icons'>
                                  delete_forever
                                </i>
                              </Form.Label>
                              {winterSelectedCourses[index]}
                            </div>
                          )) : <div />}
                        </Row>
                      </div>
                    </div>

                  </Col>
                  <Col xs={3} />
                </Form.Group>

                <Form.Group as={Row} className='semester-form-component'>
                  <Col xs={3} />
                  <Col xs={6} className='form-section-content'>

                    <div className='evening-checkbox'>
                      <Form.Label>
                        Time preference?
                      </Form.Label>

                      <ToggleButtonGroup
                        type='radio'
                        defaultValue={false}
                        name='summerTimePreference'
                        onChange={this.handleCheckboxChange}
                      >
                        <ToggleButton variant='outline-info' value={false}>Day</ToggleButton>
                        <ToggleButton variant='outline-info' value>Evening</ToggleButton>

                      </ToggleButtonGroup>
                    </div>

                    <div className='number-courses'>
                      <Form.Label>
                        How many courses do you prefer to take per semester?
                      </Form.Label>
                      <ToggleButtonGroup
                        className='num-courses-button'
                        type='radio'
                        defaultValue={4}
                        name='summer'
                        onChange={this.handleNumCourseChange}
                      >
                        <ToggleButton variant='outline-info' value={1}>1</ToggleButton>
                        <ToggleButton variant='outline-info' value={2}>2</ToggleButton>
                        <ToggleButton variant='outline-info' value={3}>3</ToggleButton>
                        <ToggleButton variant='outline-info' value={4}>4 </ToggleButton>
                        <ToggleButton variant='outline-info' value={5}>5</ToggleButton>
                        <ToggleButton variant='outline-info' value={6}>6</ToggleButton>
                      </ToggleButtonGroup>
                    </div>

                    <div className='course-preferences' style={{ display: courseMap ? 'initial' : 'none' }}>
                      <div className='course-selection-box'>
                        <Form.Label className='add-course-button'>
                          Any courses you want to take in particular?
                        </Form.Label>
                        <br />
                        <Row>
                          <Form.Label className='course-selection-label'>
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
                            <Form.Label className='course-selection-label'>
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
                          <Form.Label className='selected-courses-label' style={{ display: summerSelectedCourses.length === 0 ? 'none' : 'initial' }}>Selected Courses:</Form.Label>
                          {summerSelectedCourses ? Object.keys(summerSelectedCourses).map(index => (
                            <div className='selected-courses'>
                              <Form.Label
                                className='rm-course'
                                title='reomve course?'
                                onClick={() => this.removeCourseSelection('summerSelectedCourses', index)}
                              >
                                <i className='material-icons'>
                                  delete_forever
                                </i>
                              </Form.Label>
                              {summerSelectedCourses[index]}
                            </div>
                          )) : <div />}
                        </Row>
                      </div>
                    </div>

                  </Col>
                  <Col xs={3} />
                </Form.Group> */}
              </div>

              <Button size='large' variant='outlined' color='secondary' type='submit'>Generate My Schedule!</Button>
            </form>
          </div>
        </div>
      );
  }
}

StudentForm.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(StudentForm);
