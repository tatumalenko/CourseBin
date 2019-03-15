const express = require('express');

const router = express.Router();
const { Catalog } = require('../database/models/Catalog');

router.get('/', async (request, response) => {
  try {
    const catalog = await Catalog.find({});
    if (catalog) {
      response
        .status(200)
        .json({
          message: 'OK',
          catalog,
        });
    } else {
      response
        .status(404)
        .json({
          message: 'Catalog not found',
          catalog: null,
        });
    }
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
