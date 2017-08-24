const config = require('../config');

let getSchoolInfo = async ctx => {

  ctx.rest({
    banners: config.school.banners,
    title: config.school.title,
    logo: config.school.logo,
    packs: config.school.packs
  });
}

module.exports = {
  'GET /api/school': getSchoolInfo
}