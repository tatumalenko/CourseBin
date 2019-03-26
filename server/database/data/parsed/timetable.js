const rawTimetable = require('../raw/timetable');
const { SoftwareEngineeringDegree } = require('../../models/SoftwareEngineeringDegree');

const getTimetableCourses = async () => {
  const rawCourses = await rawTimetable.getTimetableCourses();
  const offerings = [];
  // Need to extract the non '*' characters in each course code (indices 0 to 6 inclusively)
  const allRequired = SoftwareEngineeringDegree.requirements.all.map(e => e.slice(0, 7));

  // eslint-disable-next-line no-restricted-syntax
  for (const rawCourse of rawCourses) {
    const courseCode = `${rawCourse.subject}${rawCourse.catalog}`;
    const term = parseTerm(rawCourse);
    const startYear = parseStartYear(rawCourse);

    if (allRequired.includes(courseCode) && isWithinAcademicYear({ term, startYear })) {
      const section = {
        courseCode,
        code: rawCourse.section,
        term,
        mode: rawCourse.instructionModeDescription,
        location: {
          code: rawCourse.roomCode,
          room: rawCourse.room,
          building: rawCourse.buildingCode,
        },
        kind: rawCourse.componentCode,
        times: parseTimeBlocks(rawCourse),
      };
      offerings.push(section);
    }
  }


  return offerings;
};

function isWithinAcademicYear({
  term,
  startYear,
}) {
  const validStartYearAndTermMap = {
    'FALL': '2018',
    'WINTER': '2019',
    'FALL/WINTER': '2018',
    'SUMMER': '2019',
    'SPRING': '2019',
    'SPRING/SUMMER': '2019',
  };

  return validStartYearAndTermMap[term] === startYear;
}

function parseStartYear(course) {
  const { classStartDate: startDate } = course;
  const reYear = /[0-9]{2}\/[0-9]{2}\/([0-9]{4})/;
  const startYear = startDate.match(reYear)[1];
  return startYear;
}

function parseTerm(course) {
  const { classStartDate: startDate, classEndDate: endDate } = course;
  const reMonth = /[0-9]{2}\/([0-9]{2})\/[0-9]{4}/;
  const startMonth = startDate.match(reMonth)[1];
  const endMonth = endDate.match(reMonth)[1];
  let term;
  if (startMonth === '01' && endMonth === '04') {
    term = 'WINTER';
  } else if (startMonth === '09' && endMonth === '12') {
    term = 'FALL';
  } else if (startMonth === '09' && endMonth === '04') {
    term = 'FALL/WINTER';
  } else if (startMonth === '05' && endMonth === '08') {
    term = 'SPRING/SUMMER';
  } else if (startMonth === '05' && endMonth === '06') {
    term = 'SPRING';
  } else if (startMonth === '06' && endMonth === '08') {
    term = 'SUMMER';
  } else {
    // const noTermFoundError = new Error(
    //   `No term found in parseTerm(). startDate: ${startDate} endDate: ${endDate}`,
    // );
    // console.error(noTermFoundError);
    // throw noTermFoundError;
    return '';
  }
  return term;
}

function parseTimeBlocks(course) {
  const timeBlocks = [];
  const days = [
    'modays', // API has typo :shrug:
    'tuesdays',
    'wednesdays',
    'thursdays',
    'fridays',
    'saturdays',
    'sundays' ];

  days.forEach((day) => {
    if (course[day] !== 'N') { // Somehow sometimes null means 'Y'?!
      timeBlocks.push({
        startTime: course.classStartTime,
        endTime: course.classEndTime,
        weekDay: day === 'modays' ? 'MONDAY' : day.toUpperCase().slice(0, day.length - 1),
      });
    }
  });

  return timeBlocks;
}

module.exports = {
  getTimetableCourses,
};

// getTimetableCourses().then((parsed) => {
//   console.log(parsed);
// });
