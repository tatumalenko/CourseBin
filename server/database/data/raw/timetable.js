const axios = require('axios');
const _ = require('lodash');

const configs = require('../../../../configs/configs');

const getTimetableCourses = async () => {
  const options = {
    method: 'get',
    baseURL: 'https://opendata.concordia.ca',
    auth: {
      username: configs.openApi.username,
      password: configs.openApi.password,
    },
  };

  try {
    const res = {
      biol: await axios.request(
        '/API/v1/course/schedule/filter/*/BIOL/*',
        options,
      ),
      chem: await axios.request(
        '/API/v1/course/schedule/filter/*/CHEM/*',
        options,
      ),
      civi: await axios.request(
        '/API/v1/course/schedule/filter/*/CIVI/*',
        options,
      ),
      comp: await axios.request(
        '/API/v1/course/schedule/filter/*/COMP/*',
        options,
      ),
      elec: await axios.request(
        '/API/v1/course/schedule/filter/*/ELEC/*',
        options,
      ),
      engr: await axios.request(
        '/API/v1/course/schedule/filter/*/ENGR/*',
        options,
      ),
      encs: await axios.request(
        '/API/v1/course/schedule/filter/*/ENCS/*',
        options,
      ),
      phys: await axios.request(
        '/API/v1/course/schedule/filter/*/PHYS/*',
        options,
      ),
      soen: await axios.request(
        '/API/v1/course/schedule/filter/*/SOEN/*',
        options,
      ),
    };

    return _.flatten(_.toArray(res).map(e => e.data));
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  getTimetableCourses,
};
