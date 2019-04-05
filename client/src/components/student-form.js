/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/sort-comp */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */


import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
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
  typography: {
    useNextVariants: true,
  },
});

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
  formPaper: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    display: 'flex',
    alignItems: 'left',
    justifyContent: 'flex-start',
    textAlign: 'left',
    margin: `${theme.spacing.unit}px -20px`,
    background: theme.palette.background.pr,
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
    margin: '0 24%',
    minWidth: '330px',
  },
  chips: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: theme.spacing.unit * 2,
  },
  chip: {
    margin: theme.spacing.unit / 2,
    color: '#571D2E',
    fontSize: '11px',
    fontWeight: 'bold',
    backgroundColor: 'rgba(23, 162, 184, 0.25)',
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
      terms: [ 'fall', 'winter', 'summer' ],

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

    this.handleViewChange = this.handleViewChange.bind(this);
    this.handleChangeIndex = this.handleChangeIndex.bind(this);
    this.handleNumCourseChange = this.handleNumCourseChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleFacultyChange = this.handleFacultyChange.bind(this);
    this.handleCourseSelection = this.handleCourseSelection.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.removeCourseSelection = this.removeCourseSelection.bind(this);
    this.setErrMsg = this.setErrMsg.bind(this);
    this.getCourseCatalog = this.getCourseCatalog.bind(this);
    this.parseCourseCatalog = this.parseCourseCatalog.bind(this);
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

  handleViewChange = (event, value) => {
    event.preventDefault();
    const view = _.parseInt(value);
    this.setState({ currentView: view });
  };

  handleChangeIndex = (index) => {
    this.setState({ value: index });
  };


  handleTimeChange = name => (event, timePreference) => {
    event.preventDefault();
    this.setState(
      { [name]: timePreference },
    );
  }

  handleNumCourseChange = name => (event, numCourses) => {
    event.preventDefault();
    this.setState(
      { [name]: numCourses },
    );
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

  handleFacultyChange = name => (event) => {
    event.preventDefault();
    const faculty = event.target.value;
    this.setState(
      { [name]: faculty },
    );
  }

  handleSubmit(event) {
    event.preventDefault();

    const state = this.state;

    if (state.fallNumOfCourses === 0
      && state.summerNumOfCourses === 0
      && state.winterNumOfCourses === 0) {
      const msg = 'You have selected a preference of no courses for every semester,'
        + 'please try again!';
      const newState = Object.assign({}, state);
      newState.formErrorMsg.push(msg);
      this.setState(newState);
      return;
    }

    if (state.fallSelectedCourses.length !== state.fallNumOfCourses) {
      const msg = `You indicated a preference of ${state.fallNumOfCourses} 
      courses for Fall, but did not select that amount!`;
      const newState = Object.assign({}, state);
      newState.formErrorMsg.push(msg);
      this.setState(newState);
      return;
    }
    if (state.winterSelectedCourses.length !== state.winterNumOfCourses) {
      const msg = `You indicated a preference of ${state.winterNumOfCourses} 
      courses for Winter, but did not select that amount!`;
      const newState = Object.assign({}, state);
      newState.formErrorMsg.push(msg);
      this.setState(newState);
      return;
    }
    if (state.summerSelectedCourses.length !== state.summerNumOfCourses) {
      const msg = `You indicated a preference of ${state.summerNumOfCourses} 
      courses for Summer, but did not select that amount!`;
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

  removeCourseSelection = (course, property) => (event) => {
    event.preventDefault();
    this.setState((state) => {
      const selectedCourses = [ ...state[property] ];
      const toDelete = selectedCourses.indexOf(course);
      selectedCourses.splice(toDelete, 1);
      return { [property]: selectedCourses };
    });
  }

  render() {
    const { classes, theme } = this.props;

    const {
      courseMap,
      currentView,
      terms,
      formErrorMsg,
      showPlan,
    } = this.state;

    return showPlan
      ? <Plan formData={this.generatedPlan} />
      : (
        <MuiThemeProvider theme={custTheme}>
          <div className='student-form'>
            <form onSubmit={this.handleSubmit}>
              <div className={classes.formContent}>
                <div className='header-logo'>
                  <Typography variant='h4'>CourseBin</Typography>
                </div>
                <Typography
                  component='h3'
                  variant='h6'
                  id='form-header'
                >
                  First, we will just need some basic information...
                </Typography>
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
                  {
                    terms.map(term => (
                      <TabContainer dir={theme.direction}>
                        <Paper className={classes.formPaper}>
                          <Grid container spacing={16}>
                            <Grid item xs={12}>
                              <FormLabel className='preference-label time'>
                                What is your
                                {' '}
                                {_.startCase(term)}
                                {' '}
                                time preference?
                              </FormLabel>
                            </Grid>
                            <Grid item xs={12}>
                              <div className={classes.toggleContainer}>
                                <ToggleButtonGroup
                                  defaultValue={false}
                                  value={this.state[`${term}TimePreference`]}
                                  exclusive
                                  onChange={this.handleTimeChange(`${term}TimePreference`)}
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
                            </Grid>
                            <Grid item xs={12}>
                              <FormLabel className='preference-label'>
                                How many courses do you prefer to take in the
                                {' '}
                                {_.startCase(term)}
                                ?
                              </FormLabel>
                            </Grid>
                            <Grid item xs={12}>
                              <FormControl className='student-form-control'>
                                <div className={classes.toggleContainer}>
                                  <ToggleButtonGroup
                                    defaultValue
                                    value={this.state[`${term}NumOfCourses`]}
                                    exclusive
                                    onChange={this.handleNumCourseChange(`${term}NumOfCourses`)}
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
                              </FormControl>
                            </Grid>
                            <div className='selected-courses-container'>
                              {courseMap ? (
                                <Grid container spacing={16}>
                                  <Grid item xs={12}>
                                    <FormLabel className='selector-label'>
                                      Choose a department:
                                    </FormLabel>
                                  </Grid>

                                  <Grid item xs={12}>
                                    <FormControl className='course-selector'>
                                      <Select
                                        native
                                        value={this.state[`${term}SelectedFaculty`]}
                                        onChange={this.handleFacultyChange(`${term}SelectedFaculty`)}
                                        inputProps={{
                                          name: `${term}SelectedFaculty`,
                                          id: 'demo-controlled-open-select',
                                        }}
                                      >
                                        {courseMap ? Object.keys(courseMap).map(faculty => (
                                          <option key={`${term}-${faculty}`} value={faculty}>
                                            {faculty}
                                          </option>
                                        )) : null}
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <FormLabel className='selector-label'>
                                      Choose your courses:
                                    </FormLabel>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <FormControl className='course-selector'>
                                      <NativeSelect
                                        value={`${term}SelectedCourse`}
                                        onChange={this.handleCourseSelection(`${term}SelectedCourse`)}
                                        name={`${term}SelectedCourse`}
                                      >
                                        <option value='' disabled>
                                          Select
                                        </option>
                                        {courseMap
                                          && this.state[`${term}SelectedFaculty`]
                                          && courseMap[this.state[`${term}SelectedFaculty`]]
                                          ? courseMap[this.state[`${term}SelectedFaculty`]].map(course => (
                                            <option key={`${term}-${course}`} value={course}>
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
                                <div className='course-err-msg'>{this.state[`${term}ErrMsg`]}</div>
                                <FormLabel
                                  className='selected-courses'
                                  style={{ display: this.state[`${term}SelectedCourses`].length === 0 ? 'none' : 'initial' }}
                                >
                                  Selected Courses:
                                </FormLabel>
                                {this.state[`${term}SelectedCourses`].length > 0 ? (
                                  <div className={classes.chips}>
                                    {this.state[`${term}SelectedCourses`].map(course => (
                                      <Chip
                                        key={`${term}-${course}`}
                                        variant='outlined'
                                        label={course}
                                        name={`${term}SelectedCourses`}
                                        onDelete={this.removeCourseSelection(course, `${term}SelectedCourses`)}
                                        className={classes.chip}
                                      />
                                    ))}
                                  </div>) : <div />
                                }
                              </Grid>
                          </Grid>
                        </Paper>
                      </TabContainer>
                    ))
                  }
                </SwipeableViews>
                <Button
                  id='submit'
                  size='large'
                  variant='outlined'
                  color='primary'
                  type='submit'
                >
                  Generate My Schedule!
                </Button>
                <Grid container spacing={24}>
                  {formErrorMsg.length > 0 ? formErrorMsg.map(msg => (
                    <FormLabel className='submit-error' color='secondary'>
                      {msg}
                    </FormLabel>
                  )) : null}
                </Grid>
              </div>
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
