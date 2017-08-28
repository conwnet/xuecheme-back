
const model = require('../model.js')

let authorize = async (ctx, next) => {
  if(ctx.url.startsWith('/api')) {
    let ssid = ctx.header.ssid
    let user = await model.User.findOne({where: {ssid: ssid}})
    if (user) {
      ctx.user = user
    } else {
      return ctx.throw(403);
    }
  }
  await next();
}

module.exports = authorize;