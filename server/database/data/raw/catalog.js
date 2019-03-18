const axios = require('axios');

const { SoftwareEngineeringDegree } = require('../../models/SoftwareEngineeringDegree');
const configs = require('../../../../configs/configs');

const getCatalogCourses = async () => {
  const allDegreeCatalogCodes = SoftwareEngineeringDegree.requirements.all;
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
      engr: await axios.request(
        '/API/v1/course/catalog/filter/ENGR/*/*',
        options,
      ),
      encs: await axios.request(
        '/API/v1/course/catalog/filter/ENCS/*/*',
        options,
      ),
      biol: await axios.request(
        '/API/v1/course/catalog/filter/BIOL/*/*',
        options,
      ),
      chem: await axios.request(
        '/API/v1/course/catalog/filter/CHEM/*/*',
        options,
      ),
      phys: await axios.request(
        '/API/v1/course/catalog/filter/PHYS/*/*',
        options,
      ),
      civi: await axios.request(
        '/API/v1/course/catalog/filter/CIVI/*/*',
        options,
      ),
      elec: await axios.request(
        '/API/v1/course/catalog/filter/ELEC/*/*',
        options,
      ),
      mech: await axios.request(
        '/API/v1/course/catalog/filter/MECH/*/*',
        options,
      ),
    };

    const out = [];
    Object.keys(res).forEach((key) => {
      out.push(
        ...res[key].data.filter(o => allDegreeCatalogCodes.includes(`${o.subject}${o.catalog}`)),
      );
    });

    return out;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  getCatalogCourses,
};
