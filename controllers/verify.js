
const tool = require('../tool')
const model = require('../model')

let getVerifyCode = async ctx => {
  let mobile = ctx.query.mobile

  console.log(mobile, typeof mobile)
  if(mobile.length != 11) {
    ctx.rest({ errcode: 2001, errmsg: '手机号不合法！' })
    return 0
  }
  let code = '000000' + parseInt(Math.random() * 1000000)
  code = code.slice(code.length - 6)
  tool.send_code(mobile, code)
  await ctx.user.update({
    verify_phone: mobile,
    verify_code: code,
    verify_time_out: Date.now() + 600 * 1000
  })
  ctx.rest({ errcode: null, errmsg: '发送成功！' })
}

let checkVerifyCode = async ctx => {
  let code = ctx.request.body.code;
  let user = ctx.user;
  if(user.verify_code == code && user.verify_time_out > Date.now()) {
    ctx.rest({
      errcode: null,
      errmsg: '验证成功！'
    })
  } else {
    ctx.rest({
      errcode: 1,
      errmsg: '验证码错误！'
    })
  }
}

module.exports = {
  'GET /api/verify': getVerifyCode,
  'POST /api/verify': checkVerifyCode
}