
const APIError = require('../middlewares/rest').APIError;
const model = require('../model');

let get_schools = async (ctx, next) => {
  where = {}
  let schools = await model.School.findAll({ where: where });
  let res = []
  for(let school of schools) {
    let packs = await model.Pack.findAll({ where: { school_id: school.id } })
    let min_price = 99999999;
    for(let pack of packs) if(pack.price < min_price) min_price = pack.price;
    res.push({
      id: school.id,
      name: school.name,
      province: school.province,
      city: school.city,
      address: school.address,
      headimgurl: school.headimgurl,
      headimg_list: school.headimg_list,
      min_price: min_price,
      score: school.score,
      labels: [],
      count: school.count
    })
  }
  ctx.rest(res);
}

let get_school = async (ctx, next) => {
  let school = await model.School.findById(ctx.params.id);
  ctx.rest({
    id: school.id,
    name: school.name,
    province: school.province,
    city: school.city,
    address: school.address,
    headimgurl: school.headimgurl,
    headimg_list: school.headimg_list,
    score: school.score,
    labels: [],
    count: school.count
  });
};


module.exports = {
  'GET /api/school': get_schools,
  'GET /api/school/:id': get_school
};