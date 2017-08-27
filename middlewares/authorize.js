
const model = require('../model.js')

const openApis = ['/api/ssid']

let authorize = async (ctx, next) => {
  if(!ctx.url.startsWith('/api/oauthurl') && !ctx.url.startsWith('/api/authorize')) {
    let ssid = ctx.header.ssid
    let user = await model.User.findOne({where: {ssid: ssid}})
    if (user) {
      ctx.user = user
      await next();      
    } else {
      return ctx.throw(403);
    }
  }
}

module.exports = authorize;