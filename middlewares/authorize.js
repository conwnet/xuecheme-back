
const model = require('../model.js')


let authorize = async (ctx, next) => {

  if(!ctx.request.url.startsWith('/api/authorize') && !ctx.request.url.startsWith('/api/ssid')) {
    let ssid = ctx.request.header.ssid
    let user = await model.User.findOne({where: {ssid: ssid}})
    if (user) {
      let student = await model.Student.findOne({where: {user_id: user.id}})
      if (student) user.stu_id = student.id
      let coach = await model.Coach.findOne({where: {user_id: user.id}})
      if (coach) user.coach_id = coach.id
      ctx.user = user
    } else {
      ctx.rest({
        errcode: -1,
        errmsg: '请先登录'
      })
      return 0;
    }
  }
  await next()
}

module.exports = authorize