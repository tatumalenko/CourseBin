class Course {
  constructor({
    code,
    title,
    credits,
    rawpre,
    prerequisiteCodes,
    corequisiteCodes,
    equivalentCodes,
  }) {
    this.code = code;
    this.title = title;
    this.credits = credits;
    this.rawpre = rawpre;
    this.prerequisiteCodes = prerequisiteCodes;
    this.corequisiteCodes = corequisiteCodes;
    this.equivalentCodes = equivalentCodes;
  }
}

module.exports = { Course };
