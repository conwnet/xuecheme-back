const config = require('../config');
const model = require('../model')

let getSchoolInfo = async ctx => {
  let order_cnt = await model.Order.count();
  let comment_cnt = await model.Comment.count({where: {status: 1}})
  ctx.rest({
    order_cnt: order_cnt,
    comment_cnt: comment_cnt,
    nickname: ctx.user.nickname,
    banners: config.school.banners,
    title: config.school.title,
    logo: config.school.logo,
    packs: config.school.packs
  });
}

module.exports = {
  'GET /api/school': getSchoolInfo
}