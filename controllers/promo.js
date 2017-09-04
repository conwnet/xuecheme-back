const model = require('../model')

let getPromoCode = async ctx => {
  let promo = await model.Promo.findOne({where: {user_id: user.id}});
  ctx.rest({
    promo: promo.code
  });
}

module.exports = {
  'GET /api/promo': getPromoCode
}

