const axios = require('axios');

const configs = require('../../../../configs/configs');

const getCatalogCourses = async () => {
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
      comp: await axios.request(
        '/API/v1/course/catalog/filter/COMP/*/*',
        options,
      ),
      soen: await axios.request(
        '/API/v1/course/catalog/filter/SOEN/*/*',
        options,
      ),
    };

    return [ ...res.comp.data, ...res.soen.data ];
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  getCatalogCourses,
};
