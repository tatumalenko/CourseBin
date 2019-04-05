const test = require('ava');

const { Student } = require('./Student');

const { before, after } = require('./hooks');

test.before(before);
test.after(after);

// Run tests serially instead of concurrently
test.serial('Create and delete new student', async (t) => {
  const student = {
    id: 40055122,
    name: {
      first: 'Tatum',
      last: 'Alenko',
    },
    record: {
      completedCourses: [
        { code: 'ENCS272', grade: 'A' },
        { code: 'PHYS205', grade: 'A' },
        { code: 'MATH203', grade: 'A' },
        { code: 'MATH204', grade: 'A' },
        { code: 'MATH205', grade: 'A' },
        { code: 'COMP232', grade: 'A' },
        { code: 'COMP248', grade: 'A' },
        { code: 'COMP249', grade: 'A' },
        { code: 'COMP352', grade: 'A' },
        { code: 'SOEN228', grade: 'A' },
        { code: 'SOEN287', grade: 'A' },
      ],
    },
  };

  await Student.findOneAndUpdate({ id: student.id }, student, { upsert: true }); // Add to database

  let result = await Student.findOne({ id: student.id }); // Retrieve from database
  t.truthy(result, 'Student is found in database');

  await Student.deleteOne({ id: student.id }); // Remove from database

  result = await Student.findOne({ id: student.id }); // Retrieve from database
  t.falsy(result, 'Student has been deleted from database');
});

test.serial('GPA and Standing: ACCEPTABLE', async (t) => {
  const student = {
    id: 40055122,
    name: {
      first: 'Tatum',
      last: 'Alenko',
    },
    record: {
      completedCourses: [
        { code: 'ENCS272', grade: 'A' },
        { code: 'PHYS205', grade: 'A' },
        { code: 'MATH203', grade: 'A' },
        { code: 'MATH204', grade: 'A' },
        { code: 'MATH205', grade: 'A' },
        { code: 'COMP232', grade: 'A' },
        { code: 'COMP248', grade: 'A' },
        { code: 'COMP249', grade: 'A' },
        { code: 'COMP352', grade: 'A' },
        { code: 'SOEN228', grade: 'A' },
        { code: 'SOEN287', grade: 'A' },
      ],
    },
  };

  await Student.findOneAndUpdate({ id: student.id }, student, { upsert: true }); // Add to database

  const result = await Student.findOne({ id: student.id }); // Retrieve from database

  t.is(result.gpa, '4.00');
  t.is(result.standing, 'ACCEPTABLE');

  await Student.deleteOne({ id: student.id }); // Remove from database
});

test.serial('GPA and Standing: FAILED', async (t) => {
  const student = {
    id: 40055122,
    name: {
      first: 'Tatum',
      last: 'Alenko',
    },
    record: {
      completedCourses: [
        { code: 'ENCS272', grade: 'F' },
        { code: 'PHYS205', grade: 'F' },
        { code: 'MATH203', grade: 'F' },
        { code: 'MATH204', grade: 'F' },
        { code: 'MATH205', grade: 'F' },
        { code: 'COMP232', grade: 'F' },
        { code: 'COMP248', grade: 'F' },
        { code: 'COMP249', grade: 'F' },
        { code: 'COMP352', grade: 'F' },
        { code: 'SOEN228', grade: 'F' },
        { code: 'SOEN287', grade: 'F' },
      ],
    },
  };

  await Student.findOneAndUpdate({ id: student.id }, student, { upsert: true }); // Add to database

  const result = await Student.findOne({ id: student.id }); // Retrieve from database

  t.is(result.gpa, '0.00');
  t.is(result.standing, 'FAILED');

  await Student.deleteOne({ id: student.id }); // Remove from database
});

test.serial('GPA and Standing: CONDITIONAL', async (t) => {
  const student = {
    id: 40055122,
    name: {
      first: 'Tatum',
      last: 'Alenko',
    },
    record: {
      completedCourses: [
        { code: 'ENCS272', grade: 'D+' },
        { code: 'PHYS205', grade: 'C-' },
        { code: 'MATH203', grade: 'C' },
        { code: 'MATH204', grade: 'D+' },
        { code: 'MATH205', grade: 'C-' },
        { code: 'COMP232', grade: 'C' },
        { code: 'COMP248', grade: 'D+' },
        { code: 'COMP249', grade: 'C-' },
        { code: 'COMP352', grade: 'C' },
        { code: 'SOEN228', grade: 'D+' },
        { code: 'SOEN287', grade: 'C' },
      ],
    },
  };

  await Student.findOneAndUpdate({ id: student.id }, student, { upsert: true }); // Add to database

  const result = await Student.findOne({ id: student.id }); // Retrieve from database

  t.is(result.gpa, '1.66');
  t.is(result.standing, 'CONDITIONAL');

  await Student.deleteOne({ id: student.id }); // Remove from database
});
