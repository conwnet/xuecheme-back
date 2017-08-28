const model = require('../model')
const config = require('../config')

let addOrder = async ctx => {
  if(await model.Order.findOne({where: {user_id: ctx.user.id}})) {
    return ctx.rest({errcode: 6001, errmsg: '您已经报名啦...'})
  }
  let {name, verify, promo, packId} = ctx.request.body;
  if(verify && verify == ctx.user.verify_code && ctx.user.verify_timeout > Date.now()) {
    let packs = config.school.packs;
    let pack = packs[0];
    for(let i = 0; i < packs.length; i++)
      if(packs[i].id == packId) { pack = packs[i]; break; }
    let total_fee = pack.price || 300000;
    if(promo) {
      pro = await model.Promo.findOne({where: {code: promo}})
      if(!pro) return ctx.rest({errcode: 3000, errmsg: '没有这张优惠券啊...'})
      else if(pro.times < 1) return ctx.rest({errcode: 3000, errmsg: '这张优惠券已经用过了...'})
      else { total_fee -= pro.power; await pro.update({ times: pro.times - 1}); }
    }
    await ctx.user.update({ total_fee: total_fee, trade_no: 'MMKJ' + Date.now(), pack_id: packId })
    return ctx.rest({ errmsg: '发起订单中...' })
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
