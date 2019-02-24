
const rawTimetable = require('../raw/timetable');

const getTimetableCourses = async () => {
  const rawCourses = await rawTimetable.getTimetableCourses();
  const offerings = [];

  // rawCourses.forEach(async (rawCourse) => {

  // });
  // eslint-disable-next-line no-restricted-syntax
  for (const rawCourse of rawCourses) {
    // const courseCode = `${rawCourse.subject}${rawCourse.catalog}`;
    // const course = await Catalog.findOne({ code: courseCode });
    const section = {
      courseCode: `${rawCourse.subject}${rawCourse.catalog}`,
      code: rawCourse.section,
      term: parseTerm(rawCourse),
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

  return offerings;
};

function parseTerm(course) {
  const { classStartDate: startDate, classEndDate: endDate } = course;
  const reMonth = /[0-9]{2}\/([0-9]{2})\/[0-9]{4}/;
  const startMonth = startDate.match(reMonth)[1];
  const endMonth = endDate.match(reMonth)[1];
  let term;
  if (startMonth === '01' && endMonth === '04') {
    term = 'FALL';
  } else if (startMonth === '09' && endMonth === '12') {
    term = 'WINTER';
  } else if (startMonth === '09' && endMonth === '04') {
    term = 'FALL/WINTER';
  } else if (startMonth === '05' && endMonth === '08') {
    term = 'SPRING/SUMMER';
  } else if (startMonth === '05' && endMonth === '06') {
    term = 'SPRING';
  } else if (startMonth === '06' && endMonth === '08') {
    term = 'SUMMER';
  } else {
    const noTermFoundError = new Error(`No term found in parseTerm(). startDate: ${startDate} endDate: ${endDate}`);
    console.error(noTermFoundError);
    throw noTermFoundError;
  }
  return term;
}

function parseTimeBlocks(course) {
  const timeBlocks = [];
  const days = [
    'mondays',
    'tuesdays',
    'wednesdays',
    'thursdays',
    'fridays',
    'saturdays',
    'sundays' ];

  days.forEach((day) => {
    if (course[day] === 'Y') {
      timeBlocks.push({
        startTime: course.classStartTime,
        endTime: course.classEndTime,
        weekDay: day.toUpperCase().slice(0, day.length - 1),
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
