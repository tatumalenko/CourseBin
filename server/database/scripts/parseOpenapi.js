const fs = require('fs');
const path = require('path');

const compJson = require('../openapi/comp.json');
const soenJson = require('../openapi/soen.json');

const jsonData = {
  comp: compJson,
  soen: soenJson,
};

function parseOpenapi(jsonData) {
  const parsed = {
    comp: [],
    soen: [],
  };

  const years = [ '2018', '2019' ];

  parsed.comp.push(jsonData.comp.filter(course => years.some(
    year => course.classStartDate.includes(year),
  )));

  parsed.soen.push(jsonData.soen.filter(course => years.some(
    year => course.classStartDate.includes(year),
  )));

  return parsed;
}

const parsed = parseOpenapi(jsonData);
fs.writeFileSync(path.join(__dirname, 'comp_parsed.json'), JSON.stringify(parsed.comp, null, 2));
fs.writeFileSync(path.join(__dirname, 'soen_parsed.json'), JSON.stringify(parsed.soen, null, 2));
