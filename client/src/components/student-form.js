/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable prefer-destructuring */
import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { withStyles } from '@material-ui/core/styles';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import {
  AppBar,
  Button,
  Chip,
  FormLabel,
  FormControl,
  Grid,
  Select,
  MuiThemeProvider,
  createMuiTheme,
  NativeSelect,
  Paper,
  Tabs,
  Tab,
  Typography,
} from '@material-ui/core';
import cyan from '@material-ui/core/colors/cyan';


import Plan from './plan';

const custTheme = createMuiTheme({
  palette: {
    primary: cyan,
    secondary: {
      main: '#571D2E',
      light: '#A98638',
    },
  },
});


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
  root: {
    backgroundColor: theme.palette.background.paper,
    minWidth: '500px',
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
  formContent: {
    width: '50%',
    margin: '30px 25%',
    minWidth: '400px',
  },
  chips: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: theme.spacing.unit / 2,
  },
  chip: {
    margin: theme.spacing.unit / 2,
    color: '#17a2b8',
    fontSize: '10px',
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
    this.generatedPlan = {};
    this.MAX_NUM_COURSES = 6;

    this.state = {
      courseMap: null,

      currentView: 0,

      fallTimePreference: false,
      fallNumOfCourses: 4,
      fallSelectedFaculty: null,
      fallSelectedCourse: '',
      fallSelectedCourses: [],
      fallErrMsg: null,

      winterTimePreference: false,
      winterNumOfCourses: 4,
      winterSelectedFaculty: null,
      winterSelectedCourse: '',
      winterSelectedCourses: [],
      winterErrMsg: null,

      summerTimePreference: false,
      summerNumOfCourses: 4,
      summerSelectedFaculty: null,
      summerSelectedCourse: '',
      summerSelectedCourses: [],
      summerErrMsg: null,


      formErrorMsg: [],
      showPlan: false,
    };


    this.handleFacultyChange = this.handleFacultyChange.bind(this);
    this.handleViewChange = this.handleViewChange.bind(this);
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
    this.removeFallCourseSelection = this.removeFallCourseSelection.bind(this);
    this.removeWinterCourseSelection = this.removeWinterCourseSelection.bind(this);
    this.removeSummerCourseSelection = this.removeSummerCourseSelection.bind(this);
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
    const state = this.state;
    if (state.fallSelectedCourses.length <= fallNumOfCourses) {
      this.setState({
        fallNumOfCourses,
        fallErrMsg: '',
      });
    } else {
      this.setState({
        fallNumOfCourses,
        fallErrMsg: '',
        fallSelectedCourses: [],
      });
    }
  }

  handleWinterNumCourseChange = (event, winterNumOfCourses) => {
    this.setState({ winterNumOfCourses });
  }

  handleSummerNumCourseChange = (event, summerNumOfCourses) => {
    this.setState({ summerNumOfCourses });
  }


  handleCourseSelection = name => (event) => {
    event.preventDefault();
    const state = this.state;
    const target = event.target;
    const courseCode = target.value;
    let property;

    let numCourses;
    switch (name) {
      case 'fallSelectedCourse': numCourses = 'fallNumOfCourses';
        property = 'fallSelectedCourses';
        break;
      case 'winterSelectedCourse': numCourses = 'winterNumOfCourses';
        property = 'winterSelectedCourses';
        break;
      case 'summerSelectedCourse': numCourses = 'summerNumOfCourses';
        property = 'summerSelectedCourses';
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
      newState[name] = target.value;
      this.setState(newState);
      this.setErrMsg(property, null);
    }
  }

  handleFacultyChange(event) {
    event.preventDefault();
    const target = event.target;
    switch (target.name) {
      case 'fallSelectedFaculty':
        this.setState({
          [target.name]: target.value,
          fallSelectedCourse: '',
        });
        break;
      case 'winterSelectedFaculty':

        this.setState({
          [target.name]: target.value,
          winterSelectedCourse: '',
        });
        break;
      case 'summerSelectedFaculty':
        this.setState({
          [target.name]: target.value,
          summerSelectedCourse: '',
        });
        break;
      default: break;
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    const state = this.state;

    if (state.fallNumOfCourses === 0 && state.summerNumOfCourses === 0 && state.winterNumOfCourses === 0) {
      const msg = 'You have selected a preference of no courses for every semester, please try again!';
      const newState = Object.assign({}, state);
      newState.formErrorMsg.push(msg);
      this.setState(newState);
      return;
    }

    if (state.fallSelectedCourses.length !== state.fallNumOfCourses) {
      const msg = `You indicated a preference of ${state.fallNumOfCourses} courses for Fall, but did not select that amount!`;
      const newState = Object.assign({}, state);
      newState.formErrorMsg.push(msg);
      this.setState(newState);
      return;
    }
    if (state.winterSelectedCourses.length !== state.winterNumOfCourses) {
      const msg = `You indicated a preference of ${state.winterNumOfCourses} courses for Winter, but did not select that amount!`;
      const newState = Object.assign({}, state);
      newState.formErrorMsg.push(msg);
      this.setState(newState);
      return;
    }
    if (state.summerSelectedCourses.length !== state.summerNumOfCourses) {
      const msg = `You indicated a preference of ${state.summerNumOfCourses} courses for Summer, but did not select that amount!`;
      const newState = Object.assign({}, state);
      newState.formErrorMsg.push(msg);
      this.setState(newState);
      return;
    }

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
        this.generatedPlan = response.data.plan;
        // go to schedule page
        this.setState({
          showPlan: true,
        });
      })
      .catch((error) => {
        console.log(error);
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

  removeFallCourseSelection = course => () => {
    this.setState((state) => {
      const fallSelectedCourses = [ ...state.fallSelectedCourses ];
      const toDelete = fallSelectedCourses.indexOf(course);
      fallSelectedCourses.splice(toDelete, 1);
      return { fallSelectedCourses };
    });
  }

  removeWinterCourseSelection = course => () => {
    this.setState((state) => {
      const winterSelectedCourses = [ ...state.winterSelectedCourses ];
      const toDelete = winterSelectedCourses.indexOf(course);
      winterSelectedCourses.splice(toDelete, 1);
      return { winterSelectedCourses };
    });
  }

  removeSummerCourseSelection = course => () => {
    this.setState((state) => {
      const summerSelectedCourses = [ ...state.summerSelectedCourses ];
      const toDelete = summerSelectedCourses.indexOf(course);
      summerSelectedCourses.splice(toDelete, 1);
      return { summerSelectedCourses };
    });
  }


  render() {
    const { classes, theme } = this.props;

    const {
      courseMap,

      currentView,

      fallTimePreference,
      fallSelectedCourse,
      fallNumOfCourses,
      fallSelectedFaculty,
      fallSelectedCourses,
      fallErrMsg,

      winterTimePreference,
      winterSelectedCourse,
      winterNumOfCourses,
      winterSelectedFaculty,
      winterSelectedCourses,
      winterErrMsg,

      summerTimePreference,
      summerSelectedCourse,
      summerNumOfCourses,
      summerSelectedFaculty,
      summerSelectedCourses,
      summerErrMsg,

      formErrorMsg,
      showPlan,
    } = this.state;

    return showPlan
      ? <Plan formData={this.generatedPlan} />
      : (
        <MuiThemeProvider theme={custTheme}>
          <div className='header-logo'>
            <h3>CourseBin</h3>
          </div>
          <div className='student-form'>
            <form onSubmit={this.handleSubmit}>
              <Typography component='h3' variant='h6' id='form-header'>First, we will just need some basic information... </Typography>
              <div className={classes.formContent}>
                <AppBar position='static' color='default'>
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
                    <Paper className='semester-form-component'>
                      <Grid container spacing={24}>
                        <Grid item xs={12}>
                          <FormControl>
                            <FormLabel>
                              What is your Fall time preference?
                            </FormLabel>
                            <div className={classes.toggleContainer}>
                              <ToggleButtonGroup
                                defaultValue
                                value={fallTimePreference}
                                exclusive
                                onChange={this.handleFallTimeChange}
                              >
                                <ToggleButton value={false} variant='outline-info'>
                                  <i className='material-icons toggle'>
                                    wb_sunny
                                  </i>
                                  Day
                                </ToggleButton>
                                <ToggleButton value={true} variant='outline-info'>
                                  <i className='material-icons toggle'>
                                    school
                                  </i>
                                  Evening
                                </ToggleButton>
                              </ToggleButtonGroup>
                            </div>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                          <FormLabel>
                            How many courses do you prefer to take in the Fall?
                          </FormLabel>
                          <div className={classes.toggleContainer}>
                            <ToggleButtonGroup
                              defaultValue
                              value={fallNumOfCourses}
                              exclusive
                              onChange={this.handleFallNumCourseChange}
                            >
                              <ToggleButton value={0} variant='outline-info'>None!</ToggleButton>
                              <ToggleButton value={1} variant='outline-info'>1</ToggleButton>
                              <ToggleButton value={2} variant='outline-info'>2</ToggleButton>
                              <ToggleButton value={3} variant='outline-info'>3</ToggleButton>
                              <ToggleButton value={4} variant='outline-info'>4</ToggleButton>
                              <ToggleButton value={5} variant='outline-info'>5</ToggleButton>
                              <ToggleButton value={6} variant='outline-info'>6</ToggleButton>
                            </ToggleButtonGroup>
                          </div>
                        </Grid>

                        <div className='selected-courses-container'>
                          {courseMap && fallSelectedFaculty ? (
                            <Grid container spacing={16}>
                              <FormLabel className='course-selector-label'>
                                Choose a department
                              </FormLabel>

                              <Grid item xs={12}>
                                <FormControl className='course-selector'>
                                  <Select
                                    native
                                    value={fallSelectedFaculty}
                                    onChange={this.handleFacultyChange}
                                    inputProps={{
                                      name: 'fallSelectedFaculty',
                                      id: 'demo-controlled-open-select',
                                    }}
                                  >
                                    {courseMap ? Object.keys(courseMap).map(faculty => (
                                      <option key={faculty} value={faculty}>
                                        {faculty}
                                      </option>
                                    )) : null}
                                  </Select>
                                </FormControl>
                              </Grid>

                              <FormLabel className='course-selector-label'>
                                Choose your courses
                              </FormLabel>

                              <Grid item xs={12}>
                                <FormControl className='course-selector'>
                                  <NativeSelect
                                    value={fallSelectedCourse}
                                    onChange={this.handleCourseSelection('fallSelectedCourse')}
                                    name='fallSelectedCourse'
                                  >
                                    <option value='' disabled>
                                      Select
                                    </option>
                                    {courseMap && fallSelectedFaculty && courseMap[fallSelectedFaculty] ? courseMap[fallSelectedFaculty].map(course => (
                                      <option value={course}>
                                        {course}
                                      </option>
                                    )) : null
                                    }
                                  </NativeSelect>
                                </FormControl>
                              </Grid>
                            </Grid>
                          )
                            : null
                          }

                          <Grid item xs={12}>
                            <div className='course-err-msg'>{fallErrMsg}</div>

                            <FormLabel className='selected-courses' style={{ display: fallSelectedCourses.length === 0 ? 'none' : 'initial' }}>Selected Courses:</FormLabel>
                            {fallSelectedCourses.length > 0 ? (

                              <div className={classes.chips}>
                                {fallSelectedCourses.map(course => (
                                  <Chip
                                    key={course.key}
                                    variant='outlined'
                                    label={course}
                                    onDelete={this.removeFallCourseSelection(course)}
                                    className={classes.chip}
                                  />
                                ))}

                              </div>) : <div />
                            }
                          </Grid>
                        </div>
                      </Grid>
                    </Paper>
                  </TabContainer>
                  <TabContainer dir={theme.direction}>
                    <Paper className='semester-form-component'>
                      <Grid container spacing={24}>
                        <Grid item xs={12}>
                          <FormControl>
                            <FormLabel>
                              What is your Winter time preference?
                            </FormLabel>
                            <div className={classes.toggleContainer}>
                              <ToggleButtonGroup
                                defaultValue
                                value={winterTimePreference}
                                exclusive
                                onChange={this.handleWinterTimeChange}
                              >
                                <ToggleButton value={false} variant='outline-info'>
                                  <i className='material-icons toggle'>
                                    wb_sunny
                                  </i>
                                  Day
                                </ToggleButton>
                                <ToggleButton value={true} variant='outline-info'>
                                  <i className='material-icons toggle'>
                                    school
                                  </i>
                                  Evening
                                </ToggleButton>
                              </ToggleButtonGroup>
                            </div>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                          <FormLabel>
                            How many courses do you prefer to take in the Winter?
                          </FormLabel>
                          <div className={classes.toggleContainer}>
                            <ToggleButtonGroup
                              defaultValue
                              value={winterNumOfCourses}
                              exclusive
                              onChange={this.handleWinterNumCourseChange}
                            >
                              <ToggleButton value={0} variant='outline-info'>None!</ToggleButton>
                              <ToggleButton value={1} variant='outline-info'>1</ToggleButton>
                              <ToggleButton value={2} variant='outline-info'>2</ToggleButton>
                              <ToggleButton value={3} variant='outline-info'>3</ToggleButton>
                              <ToggleButton value={4} variant='outline-info'>4</ToggleButton>
                              <ToggleButton value={5} variant='outline-info'>5</ToggleButton>
                              <ToggleButton value={6} variant='outline-info'>6</ToggleButton>
                            </ToggleButtonGroup>
                          </div>
                        </Grid>

                        <div className='selected-courses-container'>
                          {courseMap && winterSelectedFaculty ? (
                            <Grid container spacing={16}>
                              <FormLabel className='course-selector-label'>
                                Choose a department
                              </FormLabel>

                              <Grid item xs={12}>
                                <FormControl className='course-selector'>
                                  <Select
                                    native
                                    value={winterSelectedFaculty}
                                    onChange={this.handleFacultyChange}
                                    inputProps={{
                                      name: 'winterSelectedFaculty',
                                      id: 'demo-controlled-open-select',
                                    }}
                                  >
                                    {courseMap ? Object.keys(courseMap).map(faculty => (
                                      <option key={faculty} value={faculty}>
                                        {faculty}
                                      </option>
                                    )) : null}
                                  </Select>
                                </FormControl>
                              </Grid>

                              <FormLabel className='course-selector-label'>
                                Choose your courses
                              </FormLabel>

                              <Grid item xs={12}>
                                <FormControl className='course-selector'>
                                  <NativeSelect
                                    value={winterSelectedCourse}
                                    onChange={this.handleCourseSelection('winterSelectedCourse')}
                                    name='winterSelectedCourse'
                                  >
                                    <option value='' disabled>
                                      Select
                                    </option>
                                    {courseMap && winterSelectedFaculty && courseMap[winterSelectedFaculty] ? courseMap[winterSelectedFaculty].map(course => (
                                      <option value={course}>
                                        {course}
                                      </option>
                                    )) : null
                                    }
                                  </NativeSelect>
                                </FormControl>
                              </Grid>
                            </Grid>
                          )
                            : null
                          }

                          <Grid item xs={12}>
                            <div className='course-err-msg'>{winterErrMsg}</div>

                            <FormLabel className='selected-courses' style={{ display: winterSelectedCourses.length === 0 ? 'none' : 'initial' }}>Selected Courses:</FormLabel>
                            {winterSelectedCourses.length > 0 ? (

                              <div className={classes.chips}>
                                {winterSelectedCourses.map(course => (
                                  <Chip
                                    key={course.key}
                                    variant='outlined'
                                    label={course}
                                    onDelete={this.removeWinterCourseSelection(course)}
                                    className={classes.chip}
                                  />
                                ))}

                              </div>) : <div />
                            }
                          </Grid>
                        </div>
                      </Grid>
                    </Paper>
                  </TabContainer>
                  <TabContainer dir={theme.direction}>
                    <Paper className='semester-form-component'>
                      <Grid container spacing={24}>
                        <Grid item xs={12}>
                          <FormControl>
                            <FormLabel>
                              What is your Summer time preference?
                            </FormLabel>
                            <div className={classes.toggleContainer}>
                              <ToggleButtonGroup
                                defaultValue
                                value={summerTimePreference}
                                exclusive
                                onChange={this.handleSummerTimeChange}
                              >
                                <ToggleButton value={false} variant='outline-info'>
                                  <i className='material-icons toggle'>
                                    wb_sunny
                                  </i>
                                  Day
                                </ToggleButton>
                                <ToggleButton value={true} variant='outline-info'>
                                  <i className='material-icons toggle'>
                                    school
                                  </i>
                                  Evening
                                </ToggleButton>
                              </ToggleButtonGroup>
                            </div>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                          <FormLabel>
                            How many courses do you prefer to take Summer?
                          </FormLabel>
                          <div className={classes.toggleContainer}>
                            <ToggleButtonGroup
                              defaultValue
                              value={summerNumOfCourses}
                              exclusive
                              onChange={this.handleSummerNumCourseChange}
                            >
                              <ToggleButton value={0} variant='outline-info'>None!</ToggleButton>
                              <ToggleButton value={1} variant='outline-info'>1</ToggleButton>
                              <ToggleButton value={2} variant='outline-info'>2</ToggleButton>
                              <ToggleButton value={3} variant='outline-info'>3</ToggleButton>
                              <ToggleButton value={4} variant='outline-info'>4</ToggleButton>
                              <ToggleButton value={5} variant='outline-info'>5</ToggleButton>
                              <ToggleButton value={6} variant='outline-info'>6</ToggleButton>
                            </ToggleButtonGroup>
                          </div>
                        </Grid>

                        <div className='selected-courses-container'>
                          {courseMap && summerSelectedFaculty ? (
                            <Grid container spacing={16}>
                              <FormLabel className='course-selector-label'>
                                Choose a department
                              </FormLabel>

                              <Grid item xs={12}>
                                <FormControl className='course-selector'>
                                  <Select
                                    native
                                    value={summerSelectedFaculty}
                                    onChange={this.handleFacultyChange}
                                    inputProps={{
                                      name: 'summerSelectedFaculty',
                                      id: 'demo-controlled-open-select',
                                    }}
                                  >
                                    {courseMap ? Object.keys(courseMap).map(faculty => (
                                      <option key={faculty} value={faculty}>
                                        {faculty}
                                      </option>
                                    )) : null}
                                  </Select>
                                </FormControl>
                              </Grid>

                              <FormLabel className='course-selector-label'>
                                Choose your courses
                              </FormLabel>

                              <Grid item xs={12}>
                                <FormControl className='course-selector'>
                                  <NativeSelect
                                    value={summerSelectedCourse}
                                    onChange={this.handleCourseSelection('summerSelectedCourse')}
                                    name='summerSelectedCourse'
                                  >
                                    <option value='' disabled>
                                      Select
                                    </option>
                                    {courseMap && summerSelectedFaculty && courseMap[summerSelectedFaculty] ? courseMap[summerSelectedFaculty].map(course => (
                                      <option value={course}>
                                        {course}
                                      </option>
                                    )) : null
                                    }
                                  </NativeSelect>
                                </FormControl>
                              </Grid>
                            </Grid>
                          )
                            : null
                          }

                          <Grid item xs={12}>
                            <div className='course-err-msg'>{summerErrMsg}</div>

                            <FormLabel className='selected-courses' style={{ display: summerSelectedCourses.length === 0 ? 'none' : 'initial' }}>Selected Courses:</FormLabel>
                            {summerSelectedCourses.length > 0 ? (

                              <div className={classes.chips}>
                                {summerSelectedCourses.map(course => (
                                  <Chip
                                    key={course.key}
                                    variant='outlined'
                                    label={course}
                                    onDelete={this.removeSummerCourseSelection(course)}
                                    className={classes.chip}
                                  />
                                ))}

                              </div>) : <div />
                            }
                          </Grid>
                        </div>
                      </Grid>
                    </Paper>
                  </TabContainer>
                </SwipeableViews>
              </div>

              <Button id='submit' size='large' variant='outlined' color='primary' type='submit'>Generate My Schedule!</Button>

              <Grid container spacing={16}>
                {formErrorMsg.length > 0 ? formErrorMsg.map(msg => (
                  <FormLabel className='submit-error' color='secondary'>
                    {msg}
                  </FormLabel>
                )) : null}
              </Grid>
            </form>
          </div>
        </MuiThemeProvider>
      );
  }
}

StudentForm.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(StudentForm);
