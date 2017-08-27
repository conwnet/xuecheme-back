const model = require('../model')

let addOrder = async ctx => {
  let {name, verify, promo: code} = ctx.request.body;
  if(verify && verify == ctx.user.verify_code && ctx.user.verify_timeout > Date.now()) {
    if(code) {
      let promo = await model.Promo.findOne({where: {code: code}})
      if(promo) {
        console.log(promo.code)
      } else {
        ctx.rest({
          errcode: 4000,
          errmsg: '优惠码不存在哦...'
        })
      }
    } else {
      ctx.rest({errmsg: 'yes'});
    }
  } else {
    ctx.rest({
      errcode: 3000,
      errmsg: '不能放行，短信验证码不正确...'
    })
  }
}

module.exports = {
  'POST /api/order': addOrder
}
