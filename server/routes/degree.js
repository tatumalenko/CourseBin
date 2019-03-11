const express = require('express');

const router = express.Router();
const { SoftwareEngineeringDegree } = require('../database/models/SoftwareEngineeringDegree');

router.get('/soen', async (request, response) => {
  try {
    const soenDegreeRequirements = SoftwareEngineeringDegree.requirements;
    if (soenDegreeRequirements) {
      response
        .status(200)
        .json({
          message: 'OK',
          requirements: soenDegreeRequirements,
        });
    } else {
      response
        .status(404)
        .json({
          message: 'SoftwareEngineeringDegree not found',
          requirements: null,
        });
    }
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
