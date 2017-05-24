
const APIError = require('../middlewares/rest').APIError;
const model = require('../model');

let get_packs = async (ctx, next) => {
  where = { school_id: ctx.query.school_id }
  let packs = await model.Pack.findAll({where: where});
  let res = []
  packs.forEach(pack => {
    res.push({
      id: pack.id,
      school_id: pack.school_id,
      pay: pack.pay,
      title: pack.title,
      price: pack.price,
      count: pack.count,
      remark: pack.remark
    })
  })
  ctx.rest(res);
}

let get_pack = async (ctx, next) => {
  let pack = await model.Pack.findById(ctx.params.id);
  ctx.rest(pack);
};

module.exports = {
  'GET /api/pack': get_packs,
  'GET /api/pack/:id': get_pack
};