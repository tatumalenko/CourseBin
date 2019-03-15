const { Degree } = require('./Degree');

class SoftwareEngineeringDegree extends Degree {
  static get minCredits() {
    return 120;
  }

  static get requirements() {
    const requirements = {
      soen: {
        numOfCoursesRequired: 13,
        numOfCreditsRequired: undefined,
        courses: [
          'SOEN228',
          'SOEN287',
          'SOEN321',
          'SOEN331',
          'SOEN341',
          'SOEN342',
          'SOEN343',
          'SOEN344',
          'SOEN357',
          'SOEN384',
          'SOEN385',
          'SOEN390',
          'SOEN490',
        ],
      },
      comp: {
        numOfCoursesRequired: 7,
        numOfCreditsRequired: undefined,
        courses: [
          'COMP232',
          'COMP248',
          'COMP249',
          'COMP335',
          'COMP346',
          'COMP348',
          'COMP352',
        ],
      },
      engr: {
        numOfCoursesRequired: 10,
        numOfCreditsRequired: undefined,
        courses: [
          'ELEC275',
          'ENCS282',
          'ENGR201',
          'ENGR202',
          'ENGR213',
          'ENGR233',
          'ENGR301',
          'ENGR371',
          'ENGR391',
          'ENGR392',
        ],
      },
      science: {
        numOfCoursesRequired: 2,
        numOfCreditsRequired: undefined,
        courses: [
          'BIOL206*',
          'BIOL261*',
          'CHEM217*',
          'CHEM221*',
          'CIVI231',
          'ELEC321',
          'ENGR242',
          'ENGR243',
          'ENGR251',
          'ENGR361',
          'ENGR221*',
          'PHYS252*',
          'PHYS284*',
          'PHYS385*',
        ],
      },
      generalOption: {
        numOfCoursesRequired: undefined,
        numOfCreditsRequired: 16,
        courses: [
          'COMP345',
          'COMP353',
          'COMP371',
          'COMP426',
          'COMP428',
          'COMP442',
          'COMP445',
          'COMP451',
          'COMP465',
          'COMP472',
          'COMP473',
          'COMP474',
          'COMP478',
          'COMP479',
          'SOEN298',
          'SOEN422',
          'SOEN423',
          'SOEN448',
          'SOEN491',
          'ENGR411',
        ],
      },
    };

    requirements.mandatory = [
      ...requirements.soen.courses,
      ...requirements.comp.courses,
      ...requirements.engr.courses,
    ];

    requirements.optional = [
      ...requirements.science.courses,
    ];

    requirements.all = [ requirements.mandatory, ...requirements.optional ];

    return requirements;
  }
}

module.exports = { SoftwareEngineeringDegree };
