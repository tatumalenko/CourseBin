const _ = require('lodash');

const rawCatalog = require('../raw/catalog');

//Filters courses from concordiaAPI
const getCatalogCourses = async () => {
  const rawCourses = await rawCatalog.getCatalogCourses();
  const courses = [];

  rawCourses.forEach((rawCourse) => {
    const { pres, cos, eqs } = parsePrerequisites(rawCourse.prerequisites);
    const course = {
      title: rawCourse.title,
      code: `${rawCourse.subject}${rawCourse.catalog}`,
      credits: rawCourse.classUnit,
      rawpre: rawCourse.prerequisites,
      prerequisiteCodes: pres,
      corequisiteCodes: cos,
      equivalentCodes: eqs,
    };
    courses.push(course);
  });

  return _.uniqBy(courses, course => course.code);
};

function parsePrerequisites(prerequisites) {
  const rePre = /(?:(?:Prerequisite:?)|(?:PREREQ)) (.*);?/;
  const reCo = /Co-?requisite: (.*);?/;
  const reEq = /Never Taken(?:\/Not Registered)?: (.*)(?: You must complete)?/;

  let pre = prerequisites.match(rePre) ? prerequisites.match(rePre)[1] : null;
  let co = prerequisites.match(reCo) ? prerequisites.match(reCo)[1] : null;
  let eq = prerequisites.match(reEq) ? prerequisites.match(reEq)[1] : null;

  // Split off anything that follows with a pattern of 5 or more chars (e.g. Course..)
  pre = pre ? pre.split(/[a-zA-Z]{5,}/)[0] : pre;
  co = co ? co.split(/[a-zA-Z]{5,}/)[0] : co;
  eq = eq ? eq.split(/[a-zA-Z]{5,}/)[0] : eq;

  eq = eq ? eq.split(/You must/)[0] : eq;

  // Split off anything containing a semi-colon and treat as an AND clause by
  // exploding it into an array instead of a simple string
  const splitAtCommaOrSemiColon = (str) => {
    if (!str) { return null; }
    // eslint-disable-next-line no-param-reassign
    str = str.replace(/and/, ';');
    let arr;
    if (str.includes(';')) {
      arr = _.flatten(str.split(';').map(e => e.split(',')));
    } else if (str.includes(',')) {
      arr = str.split(',');
    } else {
      arr = [ str ];
    }
    return arr;
    // return explodeCodes(str);
  };
  let pres = splitAtCommaOrSemiColon(pre);
  let cos = splitAtCommaOrSemiColon(co);
  let eqs = splitAtCommaOrSemiColon(eq);

  // Split off array with a string element containing an 'or' and treat it as an OR clause by
  // exploding it into an array nested without the AND outer array
  const splitAtOr = (e) => {
    let arr;
    if (![ 'or' ].some(keyword => e.includes(keyword))) {
      arr = [ e ];
    } else {
      arr = e.split(/or/);
    }
    return arr;
  };
  pres = pres ? pres.map(splitAtOr) : null;
  cos = cos ? cos.map(splitAtOr) : null;
  eqs = eqs ? eqs.map(splitAtOr) : null;

  // Sanitize the resultings outer array by removing elements only containing spaces
  // and by trimming all spaces for each string
  const filterEmptyStrings = e => (!/^\s*$/.test(e));
  const filterNonCourseCodes = e => (/[a-zA-Z]{3}\s?[0-9]{3,4}[a-zA-Z]?/.test(e));
  const filterEmptyStringAndTrimSpaces = (outer) => {
    if (!outer) { return null; }
    const clean = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const inner of outer) {
      const newInner = inner.filter(filterEmptyStrings);
      // newInner = newInner.filter(filterNonCourseCodes);
      const newNewInner = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const e of newInner) {
        newNewInner.push(e.trim().replace(/\.|\s/g, ''));
      }
      if (newNewInner.length > 0) { clean.push(newNewInner.filter(filterNonCourseCodes)); }
    }
    return _.filter(clean, _.size);
  };

  pres = filterEmptyStringAndTrimSpaces(pres);
  cos = filterEmptyStringAndTrimSpaces(cos);
  eqs = filterEmptyStringAndTrimSpaces(eqs);

  return {
    pres,
    cos,
    eqs,
  };
}

module.exports = {
  getCatalogCourses,
};

// getCatalogCourses().then((parsed) => {
//   fs.writeFileSync(path.join(__dirname, 'output.txt'), JSON.stringify(parsed));
// });
