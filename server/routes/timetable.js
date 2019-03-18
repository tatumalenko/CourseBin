const express = require('express');

const router = express.Router();
const { Timetable } = require('../database/models/Timetable');

router.get('/', async (request, response) => {
  try {
    //const timetable = await Timetable.find({}); // change this back after
    const timetable = [
      {
        title: 'COMP-346, LECTURE UU',
        // Year, month, day, time (9:30AM)
        startDate: new Date(2018, 6, 25, 9, 30),
        endDate: new Date(2018, 6, 25, 11, 30),
        id: 0,
    
      },
      {
        title: 'BIOL-206 LECTURE',
        startDate: new Date(2018, 6, 24, 12, 0),
        endDate: new Date(2018, 6, 24, 13, 0),
        id: 1,
      },
      {
        title: 'ELEC-275 LECTURE',
        startDate: new Date(2018, 6, 23, 8, 30),
        endDate: new Date(2018, 6, 23, 10, 15),
        id: 3,
      },
      {
        title: 'SOEN-341 LECTURE',
        startDate: new Date(2018, 6, 26, 8, 30),
        endDate: new Date(2018, 6, 26, 10, 15),
        id: 4,
      },
      {
        title: 'SOEN-331 LECTURE',
        startDate: new Date(2018, 6, 27, 11, 30),
        endDate: new Date(2018, 6, 27, 13, 0),
        id: 5,
      },
    ];
    // ===== SAMPLE COURSE FORMAT =====
    /*
    {
      title: 'COMP-346, LECTURE SS',
      // Year, month, day, time (9:30AM)
      startDate: new Date(2018, 6, 25, 9, 30),
      endDate: new Date(2018, 6, 25, 11, 30),
      id: 0,
  
    }
    */
    if (true) { // change back to if (timetable) after
      response
        .status(200)
        .json({
          message: 'OK',
          timetable,
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
