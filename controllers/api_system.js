
const tool = require('../tool')
const model = require('../model')

let get_verify_code = async (ctx, next) => {
  let phone = ctx.request.body.phone

  if(phone.length != 11) {
    ctx.rest({ errcode: 2001, errmsg: '手机号不合法！' })
    return 0
  }
  let code = '000000' + parseInt(Math.random() * 1000000)
  code = code.slice(code.length - 6)
  tool.send_code(phone, code)
  await ctx.user.update({
    verify_phone: phone,
    verify_code: code,
    verify_time_out: Date.now() + 600 * 1000
  })
  ctx.rest({ errcode: null, errmsg: '发送成功！' })
}

let changePhone = async (ctx, next) => {
  let code = ctx.request.body.code
  let user = ctx.user
  if(code && code == user.verify_code && user.verify_time_out > Date.now()) {
    await user.update({ username: user.verify_phone, verify_time_out: 0 })
    ctx.rest({ errcode: null, errmsg: '绑定成功！' })
  } else {
    ctx.rest({ errcode: 2002, errmsg: '验证码错误！' })
  }

}

module.exports = {
  'POST /api/verify': get_verify_code,
  'POST /api/changePhone': changePhone
}