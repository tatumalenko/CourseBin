/* eslint max-len: 0 */
const mongoose = require('mongoose');

const { Schema } = mongoose;
const _ = require('lodash');
// const configs = require('../../../configs/configs');

class Catalog {
  static get courses() {
    return [
      // CIVI COURSES
      {
        title: 'Geology for Civil Engineers',
        code: 'CIVI231',
        credits: '3.00',
        rawpre: '',
        prerequisiteCodes: null,
        corequisiteCodes: null,
        equivalentCodes: null,
      },
      // COMP COURSES
      {
        title: 'Mathematics for Computer Science',
        code: 'COMP232',
        credits: '3.00',
        rawpre: 'Course Prerequisite: MATH204, MATH203',
        prerequisiteCodes: [ [ 'MATH204' ], [ 'MATH203' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      }, {
        title: 'Object-Oriented Programming I',
        code: 'COMP248',
        credits: '3.50',
        rawpre: 'Course Co-requisite: MATH204',
        prerequisiteCodes: null,
        corequisiteCodes: [ [ 'MATH204' ] ],
        equivalentCodes: null,
      }, {
        title: 'Object-Oriented Programming II',
        code: 'COMP249',
        credits: '3.50',
        rawpre: 'Course Prerequisite: COMP248; MATH 203; Course Co-requisite: MATH205',
        prerequisiteCodes: [ [ 'COMP248' ], [ 'MATH203' ] ],
        corequisiteCodes: [ [ 'MATH205' ] ],
        equivalentCodes: null,
      }, {
        title: 'Introduction to Theoretical Computer Science',
        code: 'COMP335',
        credits: '3.00',
        rawpre: 'Course Prerequisite: COMP249 or COEN244 and COMP238 or COMP232 or COEN231',
        prerequisiteCodes: [ [ 'COMP249', 'COEN244' ], [ 'COMP238', 'COMP232', 'COEN231' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      }, {
        title: 'ADVANCED PROGRAM DESIGN, C++',
        code: 'COMP345',
        credits: '4.00',
        rawpre: '   Course Corequisite: COMP352',
        prerequisiteCodes: null,
        corequisiteCodes: [ [ 'COMP352' ] ],
        equivalentCodes: null,
      }, {
        title: 'Operating Systems',
        code: 'COMP346',
        credits: '4.00',
        rawpre: 'Prerequisite: COMP 228 or SOEN 228; COMP 352.',
        prerequisiteCodes: [ [ 'COMP228', 'SOEN228' ], [ 'COMP352' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      }, {
        title: 'Principles of Programming Languages',
        code: 'COMP348',
        credits: '3.00',
        rawpre: '   Course Prerequisite: COMP249',
        prerequisiteCodes: [ [ 'COMP249' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      }, {
        title: 'Data Structures and Algorithms',
        code: 'COMP352',
        credits: '3.00',
        rawpre: 'Prerequisite: COMP 249; Co-requisite COMP 232',
        prerequisiteCodes: [ [ 'COMP249' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      }, {
        title: 'Databases',
        code: 'COMP353',
        credits: '4.00',
        rawpre: '   Never Taken: COMP451, COMP454, COMP458, SOEN387 You must complete 1 of the following rules   Course Prerequisite: COMP352, COEN352',
        prerequisiteCodes: [ [ 'COMP352', 'COEN352' ] ],
        corequisiteCodes: null,
        equivalentCodes: [ [ 'COMP451' ], [ 'COMP454' ], [ 'COMP458' ], [ 'SOEN387' ] ],
      }, {
        title: 'Computer Graphics',
        code: 'COMP371',
        credits: '4.00',
        rawpre: '   Never Taken: COMP376, COMP477 You must complete 1 of the following rules   Course Prerequisite: COMP352, COEN352',
        prerequisiteCodes: [ [ 'COMP352' ], [ 'COEN352' ] ],
        corequisiteCodes: null,
        equivalentCodes: [ [ 'COMP376' ], [ 'COMP477' ] ],
      }, {
        title: 'Multicore Programming',
        code: 'COMP426',
        credits: '4.00',
        rawpre: 'Prerequisite: COMP346 or COEN346',
        prerequisiteCodes: [ [ 'COMP346', 'COEN346' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      }, {
        title: 'Parallel Programming',
        code: 'COMP428',
        credits: '4.00',
        rawpre: 'Course Prerequisite: COMP346;',
        prerequisiteCodes: [ [ 'COMP346' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      }, {
        title: 'Compiler Design',
        code: 'COMP442',
        credits: '4.00',
        rawpre: 'Prerequisite: COMP 228 or SOEN 228 or COEN 311; COMP 335; COMP 352 or COEN 352',
        prerequisiteCodes: [ [ 'COMP228', 'SOEN228', 'COEN311' ], [ 'COMP335' ], [ 'COMP352', 'COEN352' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      }, {
        title: 'Data Communication and Computer Networks',
        code: 'COMP445',
        credits: '4.00',
        rawpre: 'Course Prerequisite: COMP346;',
        prerequisiteCodes: [ [ 'COMP346' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      }, {
        title: 'Design and Analysis of Algorithms',
        code: 'COMP465',
        credits: '3.00',
        rawpre: 'COMP 465',
        prerequisiteCodes: null,
        corequisiteCodes: null,
        equivalentCodes: null,
      }, {
        title: 'Artificial Intelligence',
        code: 'COMP472',
        credits: '4.00',
        rawpre: 'Course Prerequisite: COMP352 or COEN352',
        prerequisiteCodes: [ [ 'COMP352', 'COEN352' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      }, {
        title: 'Pattern Recognition',
        code: 'COMP473',
        credits: '4.00',
        rawpre: 'Course Prerequisite: COMP352',
        prerequisiteCodes: [ [ 'COMP352' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      }, {
        title: 'Intelligent Systems',
        code: 'COMP474',
        credits: '4.00',
        rawpre: 'Course Prerequisite: COMP352 or COEN352',
        prerequisiteCodes: [ [ 'COMP352', 'COEN352' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      }, {
        title: 'Image Processing',
        code: 'COMP478',
        credits: '4.00',
        rawpre: 'Course Prerequisite: COMP352',
        prerequisiteCodes: [ [ 'COMP352' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      }, {
        title: 'Information Retrieval and Web Search',
        code: 'COMP479',
        credits: '4.00',
        rawpre: 'Course Prerequisite: COMP352; ENGR371or COMP233',
        prerequisiteCodes: [ [ 'COMP352' ], [ 'ENGR371', 'COMP233' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      },
      // ELEC COURSES
      {
        title: 'Principles of Electrical Engineering',
        code: 'ELEC275',
        credits: '3.50',
        rawpre: 'Course Prerequisite: PHYS205; Course Co-requisite: ENGR213',
        prerequisiteCodes: [ [ 'PHYS205' ] ],
        corequisiteCodes: [ [ 'ENGR213' ] ],
        equivalentCodes: null,
      }, {
        title: 'Introduction to Semiconductor Materials and Devices',
        code: 'ELEC321',
        credits: '3.50',
        rawpre: 'Course Prerequisite: CHEM205, ENGR213',
        prerequisiteCodes: [ [ 'CHEM205' ], [ 'ENGR213' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      },
      // ENCS COURSES
      {
        title: 'Composition and Argumentation for Engineers',
        code: 'ENCS272',
        credits: '3.00',
        rawpre: '',
        prerequisiteCodes: null,
        corequisiteCodes: null,
        equivalentCodes: null,
      },
      {
        title: 'Technical Writing and Communication',
        code: 'ENCS282',
        credits: '3.00',
        rawpre: '   Never Taken: CIVI390, BLDG390, SOEN384, SOEN341, ENCS393, ENCS382, ELEC390, COMP495, COMP490, COMP354, COEN390, ENGR392 You must complete 1 of the following rules   Course Prerequisite: ENCS272',
        prerequisiteCodes: [ [ 'ENCS272' ] ],
        corequisiteCodes: null,
        equivalentCodes: [ [ 'CIVI390' ], [ 'BLDG390' ], [ 'SOEN384' ], [ 'SOEN341' ], [ 'ENCS393' ], [ 'ENCS382' ], [ 'ELEC390' ], [ 'COMP495' ], [ 'COMP490' ], [ 'COMP354' ], [ 'COEN390' ], [ 'ENGR392' ] ],
      },
      // ENGR COURSES
      {
        title: 'Professional Practice and Responsibility',
        code: 'ENGR201',
        credits: '1.50',
        rawpre: '   Never Taken: ENGR392',
        prerequisiteCodes: null,
        corequisiteCodes: null,
        equivalentCodes: [ [ 'ENGR392' ] ],
      }, {
        title: 'Sustainable Development and Environmental Stewardship',
        code: 'ENGR202',
        credits: '1.50',
        rawpre: '   Never Taken: ENGR392',
        prerequisiteCodes: null,
        corequisiteCodes: null,
        equivalentCodes: [ [ 'ENGR392' ] ],
      }, {
        title: 'Applied Ordinary Differential Equations',
        code: 'ENGR213',
        credits: '3.00',
        rawpre: 'Course Co-requisite: MATH204; Course Prerequisite: MATH205',
        prerequisiteCodes: [ [ 'MATH205' ] ],
        corequisiteCodes: [ [ 'MATH204' ] ],
        equivalentCodes: null,
      }, {
        title: 'Applied Advanced Calculus',
        code: 'ENGR233',
        credits: '3.00',
        rawpre: 'Course Prerequisite: MATH204, MATH205',
        prerequisiteCodes: [ [ 'MATH204' ], [ 'MATH205' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      }, {
        title: 'Statics',
        code: 'ENGR242',
        credits: '3.00',
        rawpre: 'Course Prerequisite: PHYS204, MATH204; Course Co-requisite: ENGR213',
        prerequisiteCodes: [ [ 'PHYS204' ], [ 'MATH204' ] ],
        corequisiteCodes: [ [ 'ENGR213' ] ],
        equivalentCodes: null,
      }, {
        title: 'Dynamics',
        code: 'ENGR243',
        credits: '3.00',
        rawpre: 'Course Prerequisite: ENGR213; ENGR242',
        prerequisiteCodes: [ [ 'ENGR213' ], [ 'ENGR242' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      }, {
        title: 'Thermodynamics I',
        code: 'ENGR251',
        credits: '3.00',
        rawpre: 'Course Prerequisite: MATH203',
        prerequisiteCodes: [ [ 'MATH203' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      }, {
        title: 'Engineering Management Principles and Economics',
        code: 'ENGR301',
        credits: '3.00',
        rawpre: '   Never Taken: CIVI490, ELEC390, COEN390, INDU490, MECH490A, MECH498B, MECH498C, BCEE464, BLDG493, BLDG491',
        prerequisiteCodes: null,
        corequisiteCodes: null,
        equivalentCodes: [ [ 'CIVI490' ], [ 'ELEC390' ], [ 'COEN390' ], [ 'INDU490' ], [ 'MECH490A' ], [ 'MECH498B' ], [ 'MECH498C' ], [ 'BCEE464' ], [ 'BLDG493' ], [ 'BLDG491' ] ],
      }, {
        title: 'Fluid Mechanics I',
        code: 'ENGR361',
        credits: '3.00',
        rawpre: 'Course Prerequisite: ENGR213; ENGR233; ENGR 251',
        prerequisiteCodes: [ [ 'ENGR213' ], [ 'ENGR233' ], [ 'ENGR251' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      }, {
        title: 'Probability and Statistics in Engineering',
        code: 'ENGR371',
        credits: '3.00',
        rawpre: 'Course Prerequisite:  ENGR213; ENGR233',
        prerequisiteCodes: [ [ 'ENGR213' ], [ 'ENGR233' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      }, {
        title: 'Numerical Methods in Engineering',
        code: 'ENGR391',
        credits: '3.00',
        rawpre: 'Course Prerequisite: ENGR213; ENGR 233; You must complete 1 of the following courses COMP248, COEN243, MECH215, BCEE231',
        prerequisiteCodes: [ [ 'ENGR213' ], [ 'ENGR233' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      }, {
        title: 'Impact of Technology on Society',
        code: 'ENGR392',
        credits: '3.00',
        rawpre: '   Course Prerequisite: ENCS282, ENGR202, ENGR201',
        prerequisiteCodes: [ [ 'ENCS282' ], [ 'ENGR202' ], [ 'ENGR201' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      }, {
        title: 'Special Technical Report',
        code: 'ENGR411',
        credits: '1.00',
        rawpre: 'ENCS282; permission of the Department',
        prerequisiteCodes: null,
        corequisiteCodes: null,
        equivalentCodes: null,
      },
      // MATH COURSES
      {
        title: 'Differential and Integral Calculus I',
        code: 'MATH203',
        credits: '3.00',
        rawpre: '',
        prerequisiteCodes: [ [ 'MATH201' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      },
      {
        title: 'Vectors and Matrices',
        code: 'MATH204',
        credits: '3.00',
        rawpre: '',
        prerequisiteCodes: [ [ 'MATH201' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      },
      {
        title: 'Differential and Integral Calculus II',
        code: 'MATH205',
        credits: '3.00',
        rawpre: '',
        prerequisiteCodes: [ [ 'MATH203' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      },
      // PHYS COURSES
      {
        title: 'Electricity and Magnetism',
        code: 'PHYS205',
        credits: '3.00',
        rawpre: '',
        prerequisiteCodes: [ [ 'MATH203' ], [ 'PHYS204' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      },
      {
        title: 'Introduction to Astronomy',
        code: 'PHYS284',
        credits: '3.00',
        rawpre: '',
        prerequisiteCodes: null,
        corequisiteCodes: null,
        equivalentCodes: null,
      },
      // SOEN COURSES
      {
        title: 'System Hardware',
        code: 'SOEN228',
        credits: '4.00',
        rawpre: 'Course Prerequisite: MATH203; MATH204',
        prerequisiteCodes: [ [ 'MATH203' ], [ 'MATH204' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      }, {
        title: 'Web Programming',
        code: 'SOEN287',
        credits: '3.00',
        rawpre: '   Never Taken: SOEN387; Course Prerequisite: COMP248',
        prerequisiteCodes: [ [ 'COMP248' ] ],
        corequisiteCodes: null,
        equivalentCodes: [ [ 'SOEN387' ] ],
      }, {
        title: 'Information Systems Security',
        code: 'SOEN321',
        credits: '3.00',
        rawpre: '   Course Prerequisite: COMP346',
        prerequisiteCodes: [ [ 'COMP346' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      }, {
        title: 'Introduction to Formal Methods for Software Engineering',
        code: 'SOEN331',
        credits: '3.00',
        rawpre: 'Course Prerequisite: COMP249;  COMP238 or COMP232',
        prerequisiteCodes: [ [ 'COMP249' ], [ 'COMP238', 'COMP232' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      }, {
        title: 'Software Process',
        code: 'SOEN341',
        credits: '3.00',
        rawpre: 'Prerequisite: COMP 352 or COEN 352; ENCS 282 previously or concurrently.',
        prerequisiteCodes: [ [ 'COMP352', 'COEN352' ], [ 'ENCS282' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      }, {
        title: 'Software Requirements and Specifications',
        code: 'SOEN342',
        credits: '3.00',
        rawpre: '   Course Prerequisite: SOEN341; Never Taken: SOEN343, SOEN357, SOEN431, SOEN448, SOEN490',
        prerequisiteCodes: [ [ 'SOEN341' ] ],
        corequisiteCodes: null,
        equivalentCodes: [ [ 'SOEN343' ], [ 'SOEN357' ], [ 'SOEN431' ], [ 'SOEN448' ], [ 'SOEN490' ] ],
      }, {
        title: 'Software Architecture and Design I',
        code: 'SOEN343',
        credits: '3.00',
        rawpre: '   Course Prerequisite: SOEN341; Course Corequisite: SOEN342; Never Taken: COEN421, COEN498M, SOEN344, SOEN345, SOEN431, SOEN448, SOEN490',
        prerequisiteCodes: [ [ 'SOEN341' ] ],
        corequisiteCodes: [ [ 'SOEN342' ] ],
        equivalentCodes: [ [ 'COEN421' ], [ 'COEN498M' ], [ 'SOEN344' ], [ 'SOEN345' ], [ 'SOEN431' ], [ 'SOEN448' ], [ 'SOEN490' ] ],
      }, {
        title: 'Software Architecture and Design II',
        code: 'SOEN344',
        credits: '3.00',
        rawpre: '   Course Prerequisite: SOEN343; Never Taken: SOEN390, SOEN448, SOEN449, SOEN490',
        prerequisiteCodes: [ [ 'SOEN343' ] ],
        corequisiteCodes: null,
        equivalentCodes: [ [ 'SOEN390' ], [ 'SOEN448' ], [ 'SOEN449' ], [ 'SOEN490' ] ],
      }, {
        title: 'User Interface Design',
        code: 'SOEN357',
        credits: '3.00',
        rawpre: '   Course Prerequisite: SOEN342; Never Taken: SOEN390',
        prerequisiteCodes: [ [ 'SOEN342' ] ],
        corequisiteCodes: null,
        equivalentCodes: [ [ 'SOEN390' ] ],
      }, {
        title: 'Management, Measurement and Quality Control',
        code: 'SOEN384',
        credits: '3.00',
        rawpre: '   Course Prerequisite: SOEN341, ENCS282',
        prerequisiteCodes: [ [ 'SOEN341' ], [ 'ENCS282' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      }, {
        title: 'Control Systems and Applications',
        code: 'SOEN385',
        credits: '3.00',
        rawpre: 'Course Prerequisite: ENGR213, ENGR233',
        prerequisiteCodes: [ [ 'ENGR213' ], [ 'ENGR233' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      }, {
        title: 'Web-Based Enterprise Application Design',
        code: 'SOEN387',
        credits: '3.00',
        rawpre: '',
        prerequisiteCodes: [ [ 'COMP353' ], [ 'SOEN341' ], [ 'SOEN287' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      }, {
        title: 'Software Engineering Team Design Project',
        code: 'SOEN390',
        credits: '3.50',
        rawpre: '   Course Corequisite: SOEN344, SOEN357; Never Taken: SOEN490',
        prerequisiteCodes: null,
        corequisiteCodes: [ [ 'SOEN344' ], [ 'SOEN357' ] ],
        equivalentCodes: [ [ 'SOEN490' ] ],
      }, {
        title: 'Embedded Systems and Software',
        code: 'SOEN422',
        credits: '4.00',
        rawpre: 'Course Prerequisite: COMP346;',
        prerequisiteCodes: [ [ 'COMP346' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      }, {
        title: 'Distributed Systems',
        code: 'SOEN423',
        credits: '4.00',
        rawpre: 'Course Prerequisite: COMP346;',
        prerequisiteCodes: [ [ 'COMP346' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      }, {
        title: 'Web Services and Applications',
        code: 'SOEN487',
        credits: '3.00',
        rawpre: '',
        prerequisiteCodes: [ [ 'SOEN387' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      }, {
        title: 'Capstone Software Engineering Design Project',
        code: 'SOEN490',
        credits: '4.00',
        rawpre: ' ; Course Prerequisite: SOEN390',
        prerequisiteCodes: [ [ 'SOEN390' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      }, {
        title: 'SYSTEM HARDWARE LAB',
        code: 'SOEN298',
        credits: '1.00',
        rawpre: '   Course Corequisite: COMP228',
        prerequisiteCodes: null,
        corequisiteCodes: [ [ 'COMP228' ] ],
        equivalentCodes: null,
      }, {
        title: 'SOFTWARE ENGINEERING PROJECT',
        code: 'SOEN491',
        credits: '1.00',
        rawpre: 'PREREQ SOEN491',
        prerequisiteCodes: [ [ 'SOEN491' ] ],
        corequisiteCodes: null,
        equivalentCodes: null,
      },
    ];
  }

  static find(predicate) {
    return predicate && !_.isEmpty(predicate) ? _.find(this.courses, predicate) : this.courses;
  }

  static findOne(predicate) {
    return this.find(predicate);
  }
}


const courseSchema = new Schema({
  title: { type: String, unique: false, required: true },
  code: { type: String, unique: true, required: true },
  credits: { type: Number, unique: false, required: true },
  rawpre: { type: String, unique: false, required: false },
  prerequisiteCodes: { type: [ [ String ] ], unique: false, required: false },
  corequisiteCodes: { type: [ [ String ] ], unique: false, required: false },
  equivalentCodes: { type: [ [ String ] ], unique: false, required: false },
});


module.exports = {
  // Catalog: mongoose.model('Catalog',
  //   courseSchema,
  //   configs.dbMongo.schemaCollectionNames.catalog),
  Catalog,
  courseSchema,
};
