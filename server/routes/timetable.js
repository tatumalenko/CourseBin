const express = require('express');


const router = express.Router();
const { Timetable } = require('../database/models/Timetable');
const { Section } = require('../database/models/Section');

router.get('/', async (request, response) => {
  try {
    const timetable = await Timetable.find({});
    if (timetable) {
      response
        .status(200)
        .json({
          message: 'OK',
          timetable: timetable.map(e => new Section(e)),
        });
    } else {
      response
        .status(404)
        .json({
          message: 'Timetable not found.',
          timetable: null,
        });
    }
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
